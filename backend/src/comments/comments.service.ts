import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DatabaseService } from 'src/database/database.service';
import { enrichWithUserData } from 'src/common/utils/user-enrichment.util';
import { serializeModelDates } from 'src/utils/serializeModelDates';

@Injectable()
export class CommentsService {
  constructor(private readonly databaseService: DatabaseService) { }

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

    const newComment = await this.databaseService.comments.create({
      data: {
        id: crypto.randomUUID(),
        ownerId: createCommentDto.owner_id,
        activityId: createCommentDto.activity_id,
        commentText: createCommentDto.comment_text,
        createdAt: new Date(),
      }
    });
    const enrichedNewComment = await enrichWithUserData(newComment);
    const serializedComment = serializeModelDates([enrichedNewComment])[0];
    return serializedComment;
  }

  //Find all for users or by activity
  async findAll(userId?: string, activityId?: string) {
    if (userId) {
      const userComments = await this.databaseService.comments.findMany({
        where: { ownerId: userId }
      });
      return userComments;
    } else {
        const activity = await this.databaseService.activities.findUnique({
          where: { id: activityId }
        });
        if (!activity) return [];
        // Get all comments for the activity
        const comments = await this.databaseService.comments.findMany({
          where: { activityId: activityId }
        });

        // Call FastAPI to check for offensive content
        let moderatedComments = comments;
        try {
          const response = await fetch('http://localhost:8000/moderate-comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              comments: comments.map(comment => ({
                id: comment.id,
                ownerId: comment.ownerId,
                commentText: comment.commentText,
                activityId: comment.activityId,
                createdAt: comment.createdAt.toISOString()
              }))
            })
          });
          const moderationResult = await response.json();
          moderatedComments = moderationResult.comments;
        } catch (error) {
          console.error('Error calling moderation API:', error);
        }
        // For each comment, get the ownerIds of likes and count of replies
        const commentsWithLikesAndReplyCount = await Promise.all(
          moderatedComments.map(async (comment) => {
            const likes = await this.databaseService.commentLikes.findMany({
              where: { commentId: comment.id },
              select: { ownerId: true }
            });
            const comment_likes = likes.map(like => like.ownerId);

            const replyCount = await this.databaseService.replies.count({
              where: { commentId: comment.id }
            });
            const comment_replies = replyCount;

            return { ...comment, comment_likes, comment_replies };
          })
        );
        const dataEnrichWithUserData = await enrichWithUserData(commentsWithLikesAndReplyCount);
        const serialized = serializeModelDates(dataEnrichWithUserData);
        console.log('Serialized Comments:', serialized);
        return serialized;
    }
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
