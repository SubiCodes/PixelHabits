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

  // Create activity with optional media files
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

  async findAll(habitId: string, requestingUserId: string) {
    const habit = await this.databaseService.habit.findUnique({
      where: { id: habitId },
      select: { ownerId: true },
    });
    if (!habit) {
      return [];
    }
    const isOwner = habit.ownerId === requestingUserId;
    return this.databaseService.activity.findMany({
      where: {
        habitId,
        ...(isOwner ? {} : { isPublic: true }), 
      },
      orderBy: {
        createdAt: 'desc',
      },
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
