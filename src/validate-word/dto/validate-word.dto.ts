import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateWordDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  user_word: string;
}
