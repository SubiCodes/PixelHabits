import { IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
    @IsString()
    owner_id: string;

    @IsString()
    activity_id: string;

    @IsString()
    @MaxLength(500)
    comment_text: string;
}
