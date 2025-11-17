import { Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ViewsService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createViewDto: CreateViewDto) {

    const existingView = await this.databaseService.views.findFirst({
      where: {
        ownerId: createViewDto.owner_id,
        activityId: createViewDto.activity_id,
      }
    });

    if (existingView) {
      return existingView;
    }

    return this.databaseService.views.create({
      data: {
        ownerId: createViewDto.owner_id,
        activityId: createViewDto.activity_id,
      }
    });
  }

  findAll(userId: string) {
    const userViews = this.databaseService.views.findMany({
      where: { ownerId: userId }
    });
    return userViews;
  }

  remove(id: string) {
    return this.databaseService.views.delete({
      where: { id }
    });
  }
}
