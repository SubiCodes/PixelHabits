import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RepliesService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReplyDto: CreateReplyDto) {
    return await this.databaseService.replies.create({
      data: {
        ownerId: createReplyDto.owner_id,
        commentId: createReplyDto.comment_id,
        replyText: createReplyDto.reply_text,
      },
    });
  }

  findAll() {
    return `This action returns all replies`;
  }

  async update(id: string, updateReplyDto: UpdateReplyDto) {
    return await this.databaseService.replies.update({
      where: { id },
      data: {
        replyText: updateReplyDto.reply_text,
        updatedAt: new Date(),
      },
    });
  }

  remove(id: string) {
    return this.databaseService.replies.delete({
      where: { id },
    });
  }
}
