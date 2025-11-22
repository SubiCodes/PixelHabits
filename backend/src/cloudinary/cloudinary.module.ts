import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryUploadService } from './cloudinary-upload.service';

@Module({
  providers: [CloudinaryService, CloudinaryProvider, CloudinaryUploadService],
  exports: [CloudinaryService, CloudinaryProvider, CloudinaryUploadService],
})
export class CloudinaryModule {}
