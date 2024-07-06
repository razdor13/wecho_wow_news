import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // Отримання статті за ID
  async findOne(id: number): Promise<Post | null> {
    // Отримання статті з бази даних
    const post = await this.postRepository.findOne({ where: { id } })

    if (!post) {
      throw new NotFoundException('Post not found')
    }
    // Збільшуємо кількість переглядів на один
    await this.incrementViews(id)
    return post
  }
  async findAll(): Promise<Post[]> {
    return this.postRepository.find()
  }
  // Збільшення переглядів на один
  async incrementViews(id: number): Promise<void> {
    await this.postRepository
      .createQueryBuilder()
      .update(Post)
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute()
  }
}
