import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { IGoogleUser } from 'src/types/types'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('JWT_REFRESH_TOKEN_EXPIRATION') private refreshTokenExpiration: string,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const existingUser = await this.userService.findOne(registerDto.email)
    if (existingUser) {
      throw new BadGatewayException(
        'Користувач з такою електронною поштою вже існує',
      )
    }
    const user = await this.userService.createUser(registerDto)
    return this.generateTokens(user)
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordIsMatch = await argon2.verify(user.password, pass)
    if (passwordIsMatch) {
      return user
    }
    throw new UnauthorizedException('User or password are incorrect')
  }

  async login(user) {

    return this.generateTokens(user)
  }

  async googleLogin(googleUser: IGoogleUser) {
    const { email, firstName, lastName, picture } = googleUser
    let user = await this.userService.findOne(email)
    if (!user) {
      const randomPassword = uuidv4()
      const hashedPassword = await argon2.hash(randomPassword)
      user = await this.userService.createUser({
        email: email,
        username: firstName,
        password: hashedPassword,
      })
    }
    return this.generateTokens(user)
  }

  // generateTokens(user: any) {
  //   const payload = { sub: user.id, email: user.email };
    
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     refresh_token: this.jwtService.sign(payload, { expiresIn: this.refreshTokenExpiration }),
  //   };
  // }
  generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, roles: user.roles || [] };

    // Генерація access токена з коротшим терміном дії
    const accessToken = this.jwtService.sign(payload);

    // Генерація refresh токена з довшим терміном дії
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshTokenExpiration, // Секрет для refresh токена
      expiresIn: '15m' // Термін дії для refresh токена
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return this.generateTokens({ id: payload.sub, email: payload.email });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}