import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCommentDto: CreateCommentDto) {
    const repeatedComment = await this.databaseService.comments.findFirst({
      where: {
        ownerId: createCommentDto.owner_id,
        activityId: createCommentDto.activity_id,
        commentText: createCommentDto.comment_text,
      }
    });

    if (repeatedComment) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'BAD_REQUEST',
          message: 'You have already posted this comment in this activity.',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST
      );
    };

    return this.databaseService.comments.create({
      data: {
        ownerId: createCommentDto.owner_id,
        activityId: createCommentDto.activity_id,
        commentText: createCommentDto.comment_text,
      }
    });
  }

  findAll(userId: string) {
    return this.databaseService.comments.findMany({
      where: { ownerId: userId }
    });
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.databaseService.comments.update({
      where: { id },
      data: {
        commentText: updateCommentDto.comment_text,
      }
    });
  }

  remove(id: string) {
    return this.databaseService.comments.delete({
      where: { id }
    });
  }
}
