import { Module } from '@nestjs/common';
import { CommentLikesService } from './comment_likes.service';
import { CommentLikesController } from './comment_likes.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
})
export class CommentLikesModule {}
