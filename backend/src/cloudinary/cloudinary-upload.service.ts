/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class CloudinaryUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFiles(files?: (Express.Multer.File | string)[], folder: string = 'pixel_habits_activities'): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    try {
      console.log(`Starting upload of ${files.length} files...`);

      const uploadPromises = files.map(async (file, index) => {
        // If it's a string (URL), just return it as-is
        if (typeof file === 'string') {
          console.log(`Item ${index + 1}: Keeping existing URL`);
          return file;
        }

        // Otherwise, it's a file - upload it
        const isVideo = file.mimetype.startsWith('video/');
        console.log(`Uploading file ${index + 1}/${files.length}: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

        const result = isVideo
          ? await this.cloudinaryService.uploadVideo(file, folder)
          : await this.cloudinaryService.uploadImage(file, folder);

        console.log(
          `File ${index + 1} uploaded successfully: ${result.secure_url}`,
        );
        return result.secure_url;
      });

      const mediaUrls = await Promise.all(uploadPromises);
      console.log('All files uploaded successfully');
      return mediaUrls;
    } catch (error) {
      this.handleUploadError(error);
    }
  }

  validateFiles(files: (Express.Multer.File | string)[]): void {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_MIME_TYPES =
      /^(image|video)\/(jpeg|jpg|png|gif|webp|mp4|mpeg|quicktime)$/;

    for (const file of files) {
      // Skip validation for strings (existing URLs)
      if (typeof file === 'string') {
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException({
          statusCode: 400,
          error: 'FILE_TOO_LARGE',
          message: `File ${file.originalname} exceeds maximum size of 50MB`,
          suggestion: 'Please compress or choose a smaller file',
        });
      }

      if (!ALLOWED_MIME_TYPES.test(file.mimetype)) {
        throw new BadRequestException({
          statusCode: 400,
          error: 'INVALID_FILE_TYPE',
          message: `File ${file.originalname} has invalid type`,
          suggestion:
            'Allowed: images (jpeg, png, gif, webp) and videos (mp4, mpeg, quicktime)',
        });
      }
    }
  }

  async deleteFiles(mediaUrls: string[]): Promise<void> {
    if (!mediaUrls || mediaUrls.length === 0) {
      return;
    }

    try {
      console.log(`Starting deletion of ${mediaUrls.length} files...`);
      
      const deletePromises = mediaUrls.map(async (url, index) => {
        // Extract public_id from Cloudinary URL
        const publicId = this.extractPublicIdFromUrl(url);
        
        if (!publicId) {
          console.warn(`Could not extract public_id from URL: ${url}`);
          return;
        }

        console.log(`Deleting file ${index + 1}/${mediaUrls.length}: ${publicId}`);
        
        // Determine resource type from URL (check if it's a video)
        const resourceType = url.includes('/video/') ? 'video' : 'image';
        
        await this.cloudinaryService.deleteMedia(publicId, resourceType);
        console.log(`File ${index + 1} deleted successfully`);
      });

      await Promise.all(deletePromises);
      console.log('All files deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      throw new InternalServerErrorException({
        statusCode: 500,
        error: 'DELETE_FAILED',
        message: 'Failed to delete files from cloud storage.',
        suggestion: 'Please try again. If the problem persists, contact support.',
        details: error.message,
      });
    }
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public_id from Cloudinary URL
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/subfolder/filename.jpg
      // Result: folder/subfolder/filename
      const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      return matches ? matches[1] : null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }

  private handleUploadError(error: any): never {
    console.error('Upload error:', error);
    
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
    
    throw new InternalServerErrorException({
      statusCode: 500,
      error: 'UPLOAD_FAILED',
      message: 'Failed to upload files to cloud storage.',
      suggestion: 'Please try again. If the problem persists, contact support.',
      details: error.message,
    });
  }
}
