import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async getAllPosts() {
    return this.postService.findAll();
  }
  
  @Get(':id')
  async getPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }
}