import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';

type CloudinaryInstance = typeof v2;

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: CloudinaryInstance,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'pixelhabits/images',
  ): Promise<UploadApiResponse> {
    return this.uploadToCloudinary(file, folder, 'image');
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: string = 'pixelhabits/videos',
  ): Promise<UploadApiResponse> {
    return this.uploadToCloudinary(file, folder, 'video');
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'video',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          timeout: 120000, // 2 minutes timeout for large files
          chunk_size: 6000000, // 6MB chunks for better upload reliability
          transformation:
            resourceType === 'image'
              ? [{ quality: 'auto', fetch_format: 'auto' }]
              : [{ quality: 'auto' }],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error(`Upload failed: ${error.message}`));
          }
          if (!result) return reject(new Error('Upload failed: No result returned'));
          console.log('Upload successful:', result.secure_url);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteMedia(publicId: string): Promise<any> {
    return this.cloudinary.uploader.destroy(publicId);
  }

  getOptimizedUrl(publicId: string, options: Record<string, any> = {}): string {
    return this.cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options,
    });
  }
}