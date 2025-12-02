import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { DatabaseService } from 'src/database/database.service';
import { enrichWithUserData } from 'src/common/utils/user-enrichment.util';
import { serializeModelDates } from 'src/utils/serializeModelDates';

@Injectable()
export class RepliesService {

  constructor(private readonly databaseService: DatabaseService) { }

  async create(createReplyDto: CreateReplyDto) {
    const reply = await this.databaseService.replies.create({
      data: {
        ownerId: createReplyDto.owner_id,
        commentId: createReplyDto.comment_id,
        replyText: createReplyDto.reply_text,
      },
    });

    const replyWithUserData = await enrichWithUserData(reply);
    return await serializeModelDates([replyWithUserData])[0];
  }

  async findAll(commentId: string) {
    const replies = await this.databaseService.replies.findMany({
      where: { commentId },
    });
    let moderatedReplies = replies;
    try {
      const response = await fetch(`${process.env.MICROSERVICE_ML_URL || 'http://localhost:8000'}/moderate-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comments: replies.map(reply => ({
            id: reply.id,
            ownerId: reply.ownerId,
            commentText: reply.replyText,
            activityId: reply.commentId,
            createdAt: reply.createdAt.toISOString()
          }))
        })
      });
      const moderationResult = await response.json();
      // Map the API response back to match database format
      moderatedReplies = moderationResult.comments.map((comment: any, index: number) => ({
        id: comment.id,
        ownerId: comment.owner_id || comment.ownerId,
        replyText: comment.comment_text || comment.commentText,
        commentId: comment.activity_id || comment.activityId,
        createdAt: new Date(comment.created_at || comment.createdAt),
        updatedAt: replies[index].updatedAt,   
        isOffensive: comment.isOffensive
      }));
    } catch (error) {
      console.error('Error moderating replies:', error);
    }
    const repliesWithUserData = await enrichWithUserData(moderatedReplies);
    return serializeModelDates(repliesWithUserData);
  }

  async update(id: string, updateReplyDto: UpdateReplyDto) {
    const reply = await this.databaseService.replies.update({
      where: { id },
      data: {
        replyText: updateReplyDto.reply_text,
        updatedAt: new Date(),
      },
    });
    const replyWithUserData = await enrichWithUserData(reply);
    return await serializeModelDates([replyWithUserData])[0];
  }

  remove(id: string) {
    return this.databaseService.replies.delete({
      where: { id },
    });
  }
}
