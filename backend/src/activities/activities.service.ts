import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CloudinaryUploadService } from 'src/cloudinary/cloudinary-upload.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly cloudinaryUploadService: CloudinaryUploadService,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(createActivityDto: CreateActivityDto, files?: Express.Multer.File[]) {
    if (files && files.length > 0) {
      this.cloudinaryUploadService.validateFiles(files);
    }

    const mediaUrls = await this.cloudinaryUploadService.uploadFiles(files, 'pixel_habits_activities');

    return this.databaseService.activity.create({
      data: {
        ownerId: createActivityDto.ownerId,
        habitId: createActivityDto.habitId,
        caption: createActivityDto.caption,
        isPublic: createActivityDto.isPublic ?? false,
        mediaUrls,
      },
    });
  }

  findAll(habitId: string) {
    return this.databaseService.activity.findMany({
      where: { habitId },
    });
  }

  findOne(id: string) {
    return this.databaseService.activity.findUnique({
      where: { id },
    });
  }

  update(id: string, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: string) {
    return `This action removes a #${id} activity`;
  }
}
