import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
      try {
        console.log(`Starting upload of ${files.length} files...`);
        
        const uploadPromises = files.map(async (file, index) => {
          const isVideo = file.mimetype.startsWith('video/');
          console.log(`Uploading file ${index + 1}/${files.length}: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

          const result = isVideo
            ? await this.cloudinaryService.uploadVideo(file, 'pixel_habits_activities')
            : await this.cloudinaryService.uploadImage(file, 'pixel_habits_activities');

          console.log(`File ${index + 1} uploaded successfully: ${result.secure_url}`);
          return result.secure_url;
        });

        mediaUrls.push(...await Promise.all(uploadPromises));
        console.log('All files uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        
        // Determine error type and provide specific message
        if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
          throw new InternalServerErrorException({
            statusCode: 500,
            error: 'UPLOAD_TIMEOUT',
            message: 'File upload timed out. The files may be too large or your connection is slow.',
            suggestion: 'Try uploading smaller files or check your internet connection.',
          });
        }
        
        if (error.message?.includes('network') || error.message?.includes('ECONNREFUSED')) {
          throw new InternalServerErrorException({
            statusCode: 500,
            error: 'NETWORK_ERROR',
            message: 'Network error while uploading files.',
            suggestion: 'Check your internet connection and try again.',
          });
        }
        
        if (error.message?.includes('Invalid image file') || error.message?.includes('Invalid video')) {
          throw new BadRequestException({
            statusCode: 400,
            error: 'INVALID_FILE',
            message: 'One or more files are corrupted or invalid.',
            suggestion: 'Please ensure your files are valid images or videos.',
          });
        }
        
        // Generic upload error
        throw new InternalServerErrorException({
          statusCode: 500,
          error: 'UPLOAD_FAILED',
          message: 'Failed to upload files to cloud storage.',
          suggestion: 'Please try again. If the problem persists, contact support.',
          details: error.message,
        });
      }
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
  }

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
