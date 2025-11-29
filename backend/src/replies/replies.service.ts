import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { DatabaseService } from 'src/database/database.service';
import { enrichWithUserData } from 'src/common/utils/user-enrichment.util';
import { serializeModelDates } from 'src/utils/serializeModelDates';

@Injectable()
export class RepliesService {

  constructor(private readonly databaseService: DatabaseService) {}

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

  async asyncfindAll(commentId: string) {
    const replies = await this.databaseService.replies.findMany({
      where: { commentId },
    });
    const repliesWithUserData = await enrichWithUserData(replies);
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
