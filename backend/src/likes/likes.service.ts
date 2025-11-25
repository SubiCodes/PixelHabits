import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class LikesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createLikeDto: CreateLikeDto) {
    const existingLike = await this.databaseService.likes.findFirst({
      where: {
        ownerId: createLikeDto.owner_id,
        activityId: createLikeDto.activity_id,
      }
    });

    if (existingLike) {
      await this.databaseService.likes.delete({
        where: { id: existingLike.id }
      });
      return {liked: false};
    } else {
      await this.databaseService.likes.create({
        data: {
          id: crypto.randomUUID(),
          ownerId: createLikeDto.owner_id,
          activityId: createLikeDto.activity_id,
          createdAt: new Date(),
        }
      });
      return {liked: true};
    }
  }

  findAll(userId: string) {
    return this.databaseService.likes.findMany({
      where: { ownerId: userId }
    });
  }

}
