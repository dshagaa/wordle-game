import { Injectable, Logger } from '@nestjs/common';
import { ValidateWordDto } from './dto/validate-word.dto';
import {
  CompareWords,
  CurrentSelectedWord,
  RenewSelectedWord,
} from '../helpers/validate.word.helper';

@Injectable()
export class ValidateWordService {
  async validate(body: ValidateWordDto) {
    const userWord = body.user_word.toLowerCase();
    const currentWord = await CurrentSelectedWord();
    if (!currentWord) {
      await RenewSelectedWord();
    }
    const result = CompareWords(currentWord.word, userWord);
    return { currentWord, userWord, result };
  }

  async renew() {
    await RenewSelectedWord();
    Logger.debug('Selected word changed correctly.');
  }
}
