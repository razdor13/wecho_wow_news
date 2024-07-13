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
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const existingUser = await this.userService.findOne(registerDto.email)
    if (existingUser) {
      throw new BadGatewayException(
        'Користувач з такою електронною поштою вже існує',
      )
    }
    const user = await this.userService.createUser(registerDto)
    return user
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    console.log(user)
    if (!user) {
      throw new UnauthorizedException('User not found')
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

  generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email }

    const accessToken = this.jwtService.sign(payload)

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH'),
      expiresIn: '7d',
    })
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }
  async refreshTokens(user) {
    console.log(user)
    try {
      return this.generateTokens({ id: user.sub, email: user.email })
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }
}
