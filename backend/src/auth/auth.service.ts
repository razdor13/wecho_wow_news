import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { IGoogleUser, IUser } from 'src/types/types'
import { v4 as uuidv4 } from 'uuid'
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    // Перевірка, чи існує користувач
    const existingUser = await this.userService.findOne(registerDto.email)
    if (existingUser) {
      throw new BadGatewayException(
        'Користувач з такою електронною поштою вже існує',
      )
    }
    return await this.userService.createUser(registerDto)
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    const passwordIsMatch = await argon2.verify(user.password, pass)

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user && passwordIsMatch) {
      return user
    }

    throw new UnauthorizedException('User or password are incorrect')
  }

  async login(user: IUser) {
    const { id, email } = user
    return {
      id,
      email,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    }
  }
  
  async googleLogin(googleUser:  IGoogleUser) {
    const { email, firstName, lastName, picture } = googleUser
    let user = await this.userService.findOne(email)
    if (!user) {
      
      // Генеруємо випадковий пароль
      const randomPassword = uuidv4()
      const hashedPassword = await argon2.hash(randomPassword)

      // Створюємо нового користувача
      user = await this.userService.createUser({
        email: email,
        username: firstName,
        password: hashedPassword,
      })
    }
    const payload = { id: user.id, email: user.email }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
