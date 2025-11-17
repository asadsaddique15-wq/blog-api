import { IsString, MinLength, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  comment: string; 

  @IsInt()
  postId: number; }
