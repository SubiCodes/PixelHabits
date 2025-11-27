import { IsString } from "class-validator";

export class CreateCommentLikeDto {
    @IsString()
    owner_id: string;

    @IsString()
    comment_id: string;
}

