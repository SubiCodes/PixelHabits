import { Controller, Post, Body } from '@nestjs/common';
import { CommentLikesService } from './comment_likes.service';
import { CreateCommentLikeDto } from './dto/create-comment_like.dto';

@Controller('comment-likes')
export class CommentLikesController {
  constructor(private readonly commentLikesService: CommentLikesService) {}

  @Post()
  create(@Body() createCommentLikeDto: CreateCommentLikeDto) {
    return this.commentLikesService.create(createCommentLikeDto);
  }

}
