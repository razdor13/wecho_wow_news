import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async findOne(id: number): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await queryRunner.manager.findOne(Post, { where: { id } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      await this.incrementViewCount(id, queryRunner.manager);

      await queryRunner.commitTransaction();
      return post;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { content, authorId } = createPostDto;
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new NotFoundException('User not found');
    }
  
    const newPost = this.postRepository.create({ content, author });
    return this.postRepository.save(newPost);
  }

  private async incrementViewCount(id: number, manager: EntityManager): Promise<void> {
    await manager.createQueryBuilder()
      .update(Post)
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute();
  }
}