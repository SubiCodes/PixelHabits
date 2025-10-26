import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly cloudinaryService: CloudinaryService, private readonly databaseService: DatabaseService) { }

  async create(createActivityDto: CreateActivityDto, files?: Express.Multer.File[]) {
    if (files && files.length > 0) {
      this.validateFiles(files);
    }

    const mediaUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const isVideo = file.mimetype.startsWith('video/');

        const result = isVideo
          ? await this.cloudinaryService.uploadVideo(file, 'pixel_habits_activities')
          : await this.cloudinaryService.uploadImage(file, 'pixel_habits_activities');

        return result.secure_url;
      });

      mediaUrls.push(...await Promise.all(uploadPromises));
    }

    return this.databaseService.activity.create({
      data: {
        ownerId: createActivityDto.ownerId,
        habitId: createActivityDto.habitId,
        caption: createActivityDto.caption,
        isPublic: createActivityDto.isPublic ?? false,
        mediaUrls,
      },
    });
  };

  findAll() {
    return `This action returns all activities`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }

  private validateFiles(files: Express.Multer.File[]): void {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_MIME_TYPES = /^(image|video)\/(jpeg|jpg|png|gif|webp|mp4|mpeg|quicktime)$/;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds maximum size of 50MB`
        );
      }

      if (!ALLOWED_MIME_TYPES.test(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} has invalid type. Allowed: images (jpeg, png, gif, webp) and videos (mp4, mpeg, quicktime)`
        );
      }
    }
  }
}
