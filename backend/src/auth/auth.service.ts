import { BadGatewayException, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import * as argon2 from "argon2";
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    // Перевірка, чи існує користувач
    const existingUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
    })
    
    if (existingUser) {
      throw new BadGatewayException(
        'Користувач з такою електронною поштою вже існує',
      )
    }

    // Створення нового користувача
    const newUser = await this.userService.create(registerDto)
    

    // Тут можна додати логіку для створення та повернення токену

    return newUser
  }
}
