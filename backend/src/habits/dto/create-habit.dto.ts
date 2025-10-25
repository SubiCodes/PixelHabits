import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHabitDto {
    @IsString()
    @MaxLength(100)
    title: string;

    @IsString()
    @MaxLength(500)
    description: string;

    @IsBoolean()
    @IsOptional()
    isPublic?: boolean;
}