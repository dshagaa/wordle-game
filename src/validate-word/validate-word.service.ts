import { Injectable, Logger } from '@nestjs/common';
import {
  CompareWords,
  CurrentSelectedWord,
  GenerateNewIntent,
  GetLastIntent,
  Normalize,
  RenewSelectedWord,
} from '../helpers/validate.word.helper';
import { each, map } from 'lodash';
import { getRepository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ValidateWordService {
  async validate(body: Record<string, any>) {
    const { user_id } = body;
    const userWord = Normalize(body.user_word.toLowerCase());
    let currentWord = await CurrentSelectedWord(user_id);
    if (!currentWord) {
      currentWord = await RenewSelectedWord(user_id);
    }
    // review intents amount
    const lastIntent = await GetLastIntent(currentWord.uuid, user_id);
    if (lastIntent && lastIntent.intents_count >= 5) {
      await RenewSelectedWord(user_id);
      return {
        error_code: 'maximum_limit_attempts_reached',
        error_description: 'Maximum attempts reached',
      };
    }
    // generate intent
    await GenerateNewIntent(currentWord.uuid, user_id, userWord);
    // compare words
    const result = CompareWords(currentWord.word, userWord);
    return { currentWord, userWord, result };
  }

  async renew() {
    const users = map(
      await getRepository(UserEntity).find(),
      (user) => user.uuid,
    );
    each(users, (user_id: string) => {
      RenewSelectedWord(user_id);
    });
    Logger.debug('Selected word changed correctly.');
  }
}
