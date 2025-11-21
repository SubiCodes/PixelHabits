import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateActivityDto {
  @IsString()
  ownerId: string;

  @IsString()
  habitId: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean({ message: 'isPublic must be a boolean value (true or false)' })
  @IsOptional()
  @Transform(({ value }) => {
    // Strict transformation - only accept "true", "false", true, or false
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    if (value === undefined || value === null) return undefined;
    // Any other value will fail @IsBoolean validation
    throw new Error(`isPublic must be "true" or "false", received: ${value}`);
  })
  isPublic?: boolean;

  @IsArray()
  @IsOptional()
  mediaUrls?: (Express.Multer.File | string)[];
}