import { IsString, MaxLength } from "class-validator";

export class CreateReplyDto {
    @IsString()
    owner_id: string;

    @IsString()
    comment_id: string;

    @IsString()
    @MaxLength(500)
    reply_text: string;
}
