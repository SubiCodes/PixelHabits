import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CloudinaryUploadService } from 'src/cloudinary/cloudinary-upload.service';
import { DatabaseService } from 'src/database/database.service';
import { enrichWithUserData } from 'src/common/utils/user-enrichment.util';

function serializeModelDates(arr: any[]) {
  return arr.map(item => {
    const result = { ...item };
    Object.keys(result).forEach(key => {
      if (result[key] instanceof Date) {
        result[key] = result[key].toISOString();
      }
    });
    return result;
  });
}

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly cloudinaryUploadService: CloudinaryUploadService,
    private readonly databaseService: DatabaseService,
  ) { }

  // Create activity with optional media files
  async create(createActivityDto: CreateActivityDto) {
    //Check if habit exists
    const habit = await this.databaseService.habits.findUnique({
      where: { id: createActivityDto.habitId },
      include: { activities: true },
    });
    if (!habit) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'NOT_FOUND',
        message: 'Habit not found',
        suggestion: 'This habit may have been deleted',
        timestamp: new Date().toISOString(),
      });
    };

    const today = new Date();
    const todayStr = today.toDateString();
    const hasActivityToday = habit.activities.some(activity => {
      const activityDate = new Date(activity.createdAt);
      return activityDate.toDateString() === todayStr;
    });

    if (hasActivityToday) {
      throw new ConflictException('An activity for today already exists');
    }

    if (createActivityDto.mediaUrls && createActivityDto.mediaUrls.length > 0) {
      this.cloudinaryUploadService.validateFiles(createActivityDto.mediaUrls);
    };

    const mediaUrls = await this.cloudinaryUploadService.uploadFiles(createActivityDto.mediaUrls, 'pixel_habits_activities');

    return this.databaseService.activities.create({
      data: {
        id: crypto.randomUUID(),
        ownerId: createActivityDto.ownerId,
        habitId: createActivityDto.habitId,
        caption: createActivityDto.caption ?? "",
        isPublic: createActivityDto.isPublic ?? false,
        mediaUrls,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  //Get all activities for the specific habit, with privacy check
  async findAll(habitId: string, requestingUserId: string) {
    const habit = await this.databaseService.habits.findUnique({
      where: { id: habitId },
      select: { ownerId: true },
    });
    if (!habit) {
      return [];
    }
    const isOwner = habit.ownerId === requestingUserId;
    const rawActivities = await this.databaseService.activities.findMany({
      where: {
        habitId,
        ...(isOwner ? {} : { isPublic: true }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        likes: { select: { ownerId: true } },
        comments: { select: { id: true } }
      }
    });

    // Map likes to array of ownerIds, comments to count, and remove original likes/comments arrays
    let activities = rawActivities.map(activity => {
      const { likes, comments, ...rest } = activity;
      return {
        ...rest,
        likes: Array.isArray(likes) ? likes.map(like => like.ownerId) : [],
        comments: Array.isArray(comments) ? comments.length : 0
      };
    });

    // Enrich with user data if available
    try {
      if (activities.length > 0 && typeof enrichWithUserData === 'function') {
        activities = await enrichWithUserData(activities);
        activities = activities.map(act => serializeModelDates([act])[0]);
      }
    } catch {
      // enrichment util not available, skip
    }
    return activities;
  }

  async findUserActivities(userId: string, requestingUserId: string) {
    const isOwner = userId === requestingUserId;
    if (isOwner) {
      const activities = await this.databaseService.activities.findMany({
        where: { ownerId: userId },
        orderBy: { createdAt: 'desc' },
      })
      return activities;
    }
  }

  findOne(id: string) {
    return this.databaseService.activities.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateActivityDto: UpdateActivityDto, mediaUrlsToDelete?: string[], files?: Array<Express.Multer.File>) {
    //Validate mediaUrls if provided
    if (files && files.length > 0) {
      this.cloudinaryUploadService.validateFiles(files);
    }

    //Get existing activity to access current mediaUrls
    const existingActivity = await this.databaseService.activities.findUnique({
      where: { id },
    });

    //Process mediaUrls: use the DTO mediaUrls which has placeholders and user's desired order
    let mediaUrls = (updateActivityDto.mediaUrls && Array.isArray(updateActivityDto.mediaUrls))
      ? [...(updateActivityDto.mediaUrls as string[])]
      : (existingActivity?.mediaUrls || []);
    let newMedias: string[] = [];

    if (files && files.length > 0) {
      const uploadedMedias = await this.cloudinaryUploadService.uploadFiles(files, 'pixel_habits_activities');
      newMedias = uploadedMedias;
    }

    //Change the 0's to the new uploads
    let newMediaState = 0;
    for (let i = 0; i < mediaUrls.length; i++) {
      if (mediaUrls[i] === '0') {
        if (newMediaState < newMedias.length) {
          mediaUrls[i] = newMedias[newMediaState];
          newMediaState++;
        } else {
          mediaUrls.splice(i, 1);
          i--;
        }
      }
    }

    if (mediaUrlsToDelete && mediaUrlsToDelete.length > 0) {
      await this.cloudinaryUploadService.deleteFiles(mediaUrlsToDelete);
      mediaUrls = mediaUrls.filter(url => !mediaUrlsToDelete.includes(url));
    }

    return this.databaseService.activities.update({
      where: { id },
      data: {
        caption: updateActivityDto.caption ?? existingActivity?.caption,
        isPublic: updateActivityDto.isPublic ?? existingActivity?.isPublic,
        mediaUrls,
      },
    });
  }

  async remove(id: string) {
    const existingActivity = await this.databaseService.activities.findUnique({
      where: { id },
    });

    if (existingActivity && existingActivity.mediaUrls.length > 0) {
      await this.cloudinaryUploadService.deleteFiles(existingActivity.mediaUrls);
    }

    return await this.databaseService.activities.delete({
      where: { id },
    });
  }
}
