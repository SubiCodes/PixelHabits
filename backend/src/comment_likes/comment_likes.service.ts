import { Injectable } from '@nestjs/common';
import { CreateCommentLikeDto } from './dto/create-comment_like.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CommentLikesService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createCommentLikeDto: CreateCommentLikeDto) {
    const existingLike = await this.databaseService.commentLikes.findFirst({
      where: {
        ownerId: createCommentLikeDto.owner_id,
        commentId: createCommentLikeDto.comment_id,
      },
    });

    if (existingLike) {
      return this.databaseService.commentLikes.delete({
        where: {
          ownerId_commentId: {
            ownerId: createCommentLikeDto.owner_id,
            commentId: createCommentLikeDto.comment_id,
          }
        }
      })
    } else {
      return this.databaseService.commentLikes.create({
        data: {
          ownerId: createCommentLikeDto.owner_id,
          commentId: createCommentLikeDto.comment_id,
        }
      })
    }
  }
}
