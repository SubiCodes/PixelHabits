import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';

type CloudinaryInstance = typeof v2;

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: CloudinaryInstance,
  ) { }

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
      // Check if file exceeds 40MB transformation limit
      if (file.size > 40 * 1024 * 1024) {
        return reject(new Error('File exceeds 40MB limit for transformation'));
      }

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

  // private async uploadToCloudinary(
  //   file: Express.Multer.File,
  //   folder: string,
  //   resourceType: 'image' | 'video',
  // ): Promise<UploadApiResponse> {
  //   const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${file.originalname}`);

  //   try {
  //     // Write buffer to temp file
  //     await fs.promises.writeFile(tempFilePath, file.buffer);

  //     // Upload using file path - cast or await the promise
  //     const result = await this.cloudinary.uploader.upload_large(tempFilePath, {
  //       folder,
  //       resource_type: resourceType,
  //       chunk_size: 6000000,
  //       transformation: resourceType === 'image'
  //         ? [{ quality: 'auto', fetch_format: 'auto' }]
  //         : [{ quality: 'auto' }],
  //     }) as UploadApiResponse; // Type assertion

  //     return result;
  //   } finally {
  //     // Clean up temp file
  //     await fs.promises.unlink(tempFilePath).catch(() => { });
  //   }
  // }

  async deleteMedia(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<any> {
    return this.cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
  }

  getOptimizedUrl(publicId: string, options: Record<string, any> = {}): string {
    return this.cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options,
    });
  }
}