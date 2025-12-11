import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateSearchDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsString({ each: true })
  searches: string[];
}
