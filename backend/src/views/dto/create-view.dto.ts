import { IsString } from "class-validator";

export class CreateViewDto {
    @IsString()
    owner_id: string;

    @IsString()
    activity_id: string;
}
