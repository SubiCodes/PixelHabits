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
        id: crypto.randomUUID(),
        ownerId: createCommentDto.owner_id,
        activityId: createCommentDto.activity_id,
        commentText: createCommentDto.comment_text,
        createdAt: new Date(),
      }
    });
  }

  findAll(userId: string) {
    return this.databaseService.comments.findMany({
      where: { ownerId: userId }
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    // Check if comment exists first (helps with pooling issues)
    const comment = await this.databaseService.comments.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'NOT_FOUND',
          message: 'Comment not found',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.NOT_FOUND
      );
    }

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
