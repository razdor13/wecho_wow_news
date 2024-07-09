import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { IUser } from 'src/types/types'

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

    // Створення нового користувача
    return await this.userService.createUser(registerDto)

    // Тут можна додати логіку для створення та повернення токену
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    const passwordIsMatch = await argon2.verify(user.password, pass)
    console.log(passwordIsMatch)
    if (user && passwordIsMatch) {
      return user
    }

    throw new UnauthorizedException('User or password are incorrect')
  }
  async login(user: IUser) {
    const {id , email} = user
    return {
      id , email, token : this.jwtService.sign({id: user.id , email : user.email})
    };
  }
}
