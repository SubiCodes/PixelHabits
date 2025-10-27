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
  ) { }

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

  async update(id: string, updateActivityDto: UpdateActivityDto, mediaUrlsToDelete?: string[], files?: (Express.Multer.File | string)[]) {
    if (files && files.length > 0) {
      this.cloudinaryUploadService.validateFiles(files);
    }

    //Check if the activity exists
    const existingActivity = await this.databaseService.activity.findUnique({
      where: { id },
    });
    if (!existingActivity) {
      throw new Error(`Activity with id ${id} not found`);
    };

    //Upload the new files and get the URLs if one exists
    let mediaUrls = existingActivity.mediaUrls;

    if (files && files.length > 0) {
      mediaUrls = await this.cloudinaryUploadService.uploadFiles(files, 'pixel_habits_activities');
    }

    //Delete the urls here

    //Update the activity with new data
    return this.databaseService.activity.update({
      where: { id },
      data: {
        caption: updateActivityDto.caption ?? existingActivity.caption,
        isPublic: updateActivityDto.isPublic ?? existingActivity.isPublic,
        mediaUrls,
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} activity`;
  }
}
