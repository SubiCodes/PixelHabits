import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { CreateActivityDto } from './create-activity.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsArray()
  @IsOptional()
  mediaUrls?: (Express.Multer.File | string)[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mediaUrlsToDelete?: string[];
}