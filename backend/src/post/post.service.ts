import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from './entities/post.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { User } from 'src/user/entities/user.entity'

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name)

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<Post> {
    const result = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .update()
      .set({ views: () => 'views + 1' })
      .returning('*')
      .execute()
    console.log(result)
    if (result.affected === 0) {
      throw new NotFoundException('Post not found')
    }

    return result.raw[0]
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find()
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { content, authorId } = createPostDto
    const author = await this.userRepository.findOne({
      where: { id: authorId },
    })
    if (!author) {
      throw new NotFoundException('User not found')
    }

    const newPost = this.postRepository.create({ content, author })
    return this.postRepository.save(newPost)
  }
  async findAllWithPagination(page: number, limit: number) {
    const posts = await this.postRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    })

    return posts
  }
}
