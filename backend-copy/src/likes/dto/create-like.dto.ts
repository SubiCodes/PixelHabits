import { IsString } from "class-validator";

export class CreateLikeDto {
    @IsString()
    owner_id: string;
    
    @IsString()
    activity_id: string;
}
