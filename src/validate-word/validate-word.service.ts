import { Injectable } from '@nestjs/common';
import { ValidateWordDto } from './dto/validate-word.dto';
import { CompareWords, GetRandomWord } from '../helpers/validate.word.helper';

@Injectable()
export class ValidateWordService {
  async validate(body: ValidateWordDto) {
    const userWord = body.user_word.toLowerCase();
    const randomWord = await GetRandomWord();
    const result = CompareWords(randomWord, userWord);
    return { randomWord, userWord, result };
  }
}
