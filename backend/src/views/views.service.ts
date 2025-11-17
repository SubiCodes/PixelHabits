import { Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { DatabaseService } from 'src/database/database.service';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class ViewsService {
  constructor(private readonly databaseService: DatabaseService) { }

  create(createViewDto: CreateViewDto) {
    return this.databaseService.views.create({
      data: {
        id: createId(),
        ownerId: createViewDto.owner_id,
        activityId: createViewDto.activity_id,
      }
    });
  }

  findAll() {
    return `This action returns all views`;
  }

  findOne(id: number) {
    return `This action returns a #${id} view`;
  }

  update(id: number, updateViewDto: UpdateViewDto) {
    return `This action updates a #${id} view`;
  }

  remove(id: number) {
    return `This action removes a #${id} view`;
  }
}
