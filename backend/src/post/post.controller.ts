import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

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
  @Post()
  async createPost(@Body() createPostDto :CreatePostDto ) {
    console.log(createPostDto)
    return this.postService.create(createPostDto)
  }
}