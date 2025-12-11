import { IsString, IsArray } from 'class-validator';

export class UpdateSearchDto {
  @IsArray()
  @IsString({ each: true })
  searches: string[];
}
