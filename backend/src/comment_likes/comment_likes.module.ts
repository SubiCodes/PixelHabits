import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment_likes.service';
import { CommentLikesController } from './comment_likes.controller';

@Module({
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
})
export class CommentLikesModule {}
