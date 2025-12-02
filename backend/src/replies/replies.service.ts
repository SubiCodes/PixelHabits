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

    try {
      const response = await fetch(`${process.env.MICROSERVICE_ML_URL || 'http://localhost:8000'}/moderate-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reply.id,
          ownerId: reply.ownerId,
          commentText: reply.replyText,
          activityId: reply.commentId,
          createdAt: reply.createdAt.toISOString()
        })
      });
      const moderationResult = await response.json();
      // Map the API response back to match database format
      const moderatedReply = { ...reply, isOffensive: moderationResult.isOffensive };
      const replyWithUserData = await enrichWithUserData(moderatedReply);
      return serializeModelDates([replyWithUserData])[0];
    } catch (error) {
      console.error('Error moderating reply:', error);
      const replyWithUserData = await enrichWithUserData(reply);
      return serializeModelDates([replyWithUserData])[0];
    }
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
      moderatedReplies = moderationResult.comments.map((reply: any, index: number) => ({
        id: reply.id,
        ownerId: reply.owner_id || reply.ownerId,
        replyText: reply.comment_text || reply.commentText,
        commentId: reply.activity_id || reply.activityId,
        createdAt: new Date(reply.created_at || reply.createdAt),
        updatedAt: replies[index].updatedAt,
        isOffensive: reply.isOffensive
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
