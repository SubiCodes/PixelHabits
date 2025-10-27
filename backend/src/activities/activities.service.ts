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
  async create(createActivityDto: CreateActivityDto) {
    if (createActivityDto.mediaUrls && createActivityDto.mediaUrls.length > 0) {
      this.cloudinaryUploadService.validateFiles(createActivityDto.mediaUrls);
    }

    const mediaUrls = await this.cloudinaryUploadService.uploadFiles(createActivityDto.mediaUrls, 'pixel_habits_activities');

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

  //Get all activities for the specific habit, with privacy check
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

  async update(id: string, updateActivityDto: UpdateActivityDto, mediaUrlsToDelete?: string[]) {
    //Validate mediaUrls if provided
    if (updateActivityDto.mediaUrls && updateActivityDto.mediaUrls.length > 0) {
      this.cloudinaryUploadService.validateFiles(updateActivityDto.mediaUrls);
    }

    //Get existing activity to access current mediaUrls
    const existingActivity = await this.databaseService.activity.findUnique({
      where: { id },
    });

    //Process mediaUrls: strings pass through, files get uploaded
    let mediaUrls = existingActivity?.mediaUrls || [];

    if (updateActivityDto.mediaUrls && updateActivityDto.mediaUrls.length > 0) {
      mediaUrls = await this.cloudinaryUploadService.uploadFiles(updateActivityDto.mediaUrls, 'pixel_habits_activities');
    }

    //Delete media URLs from Cloudinary
    if (mediaUrlsToDelete && mediaUrlsToDelete.length > 0) {
      await this.cloudinaryUploadService.deleteFiles(mediaUrlsToDelete);
    }

    return this.databaseService.activity.update({
      where: { id },
      data: {
        caption: updateActivityDto.caption ?? existingActivity?.caption,
        isPublic: updateActivityDto.isPublic ?? existingActivity?.isPublic,
        mediaUrls,
      },
    });
  }

  async remove(id: string) {
    const existingActivity = await this.databaseService.activity.findUnique({
      where: { id },
    });

    if (existingActivity && existingActivity.mediaUrls.length > 0) {
      await this.cloudinaryUploadService.deleteFiles(existingActivity.mediaUrls);
    }

    return await this.databaseService.activity.delete({
      where: { id },
    });
  }
}
