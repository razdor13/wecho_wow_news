import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { RegisterDto } from 'src/auth/dto/register.dto'
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const newUser = this.userRepository.create(registerDto)
    newUser.password = await argon2.hash(newUser.password)

    try {
      return await this.userRepository.save(newUser)
    } catch (error) {
      throw new Error('Error saving the new user: ' + error.message)
    }
  }
  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email: email } })
  }
}
