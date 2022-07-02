import { Injectable } from '@nestjs/common';
import { ValidateWordDto } from './dto/validate-word.dto';
import { map } from 'lodash';

@Injectable()
export class ValidateWordService {
  validate(body: ValidateWordDto): any {
    const { user_word } = body;
    return new Promise((res) => {
      const result = map(user_word.toLowerCase(), (letter, index) => {
        return { letter, value: 1 };
      });
      res(result);
    });
  }
}
