import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  ownerId: string;

  @IsString()
  habitId: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = false;
}