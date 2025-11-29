import { Injectable } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RepliesService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReplyDto: CreateReplyDto) {
    const reply = await this.databaseService.replies.create({
      data: {
        id: crypto.randomUUID(),
        ownerId: createReplyDto.owner_id,
        activityId: createReplyDto.activity_id,
        replyText: createReplyDto.reply_text,
      },
    });
  }

  findAll() {
    return `This action returns all replies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reply`;
  }

  update(id: number, updateReplyDto: UpdateReplyDto) {
    return `This action updates a #${id} reply`;
  }

  remove(id: number) {
    return `This action removes a #${id} reply`;
  }
}
