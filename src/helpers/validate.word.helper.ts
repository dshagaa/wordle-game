import axios from 'axios';
import {
  filter,
  find,
  get,
  includes,
  isEmpty,
  map,
  nth,
  random,
  size,
  split,
} from 'lodash';
import * as fs from 'fs';
import * as path from 'path';
import { SelectedWordsEntity } from '../validate-word/entities/selected.words.entity';
import { getRepository } from 'typeorm';
import { UnprocessableEntityException } from '@nestjs/common';
import { RecordsEntity } from '../validate-word/entities/records.entity';
import { AnsweredWordsEntity } from '../validate-word/entities/answered.words.entity';
import { GlobalHelper } from './global.helper';

const WORD_LIST_URL = 'https://gitlab.com/d2945/words/-/raw/main/words.txt';
let WORD_LIST = [];
const PATH = path.join(
  '/',
  get(process, ['env', 'STORAGE_PATH'], '/tmp/storage'),
);
const FILE = 'word_list.txt';

async function StoreWordList(data: string[]) {
  fs.readdir(PATH, (err, files) => {
    if (err) {
      fs.mkdirSync(PATH, { recursive: true });
    }
    fs.writeFileSync(path.join('/', PATH, FILE), JSON.stringify({ data }));
  });
}

async function ReadStoredWordList() {
  try {
    const content = fs.readFileSync(path.join('/', PATH, FILE), 'utf8');
    if (content) {
      return get(JSON.parse(content), 'data');
    }
  } catch (err) {
    return [];
  }
}

const GetStoredWordList = async (): Promise<string[]> => {
  WORD_LIST = await ReadStoredWordList();
  if (isEmpty(WORD_LIST)) {
    const { data } = await axios.get(WORD_LIST_URL, {
      headers: {
        'Content-Type': 'text/text; charset=UTF-8',
      },
      transformResponse: (data) => {
        const list = split(data, '\n');
        return filter(list, (word: string) => size(word) === 5);
      },
    });
    await StoreWordList(data);
    WORD_LIST = data;
  }
  return WORD_LIST;
};

const GetRandomWord = async (): Promise<string> => {
  const list: string[] = await GetStoredWordList();
  return get(list, random(0, size(list) - 1)).toLowerCase();
};

const GetLatestSelectedWords = async (amount: number) => {
  return await getRepository(SelectedWordsEntity).find({
    order: {
      id: 'DESC',
    },
    take: amount,
  });
};

async function RenewSelectedWord(user_id: string) {
  const word = await GetRandomWord();
  const previousWords = map(
    await GetLatestSelectedWords(100),
    (selectedWord) => selectedWord.word,
  );
  if (includes(previousWords, word)) {
    return RenewSelectedWord(user_id);
  }
  const newWord = new SelectedWordsEntity();
  newWord.word = word;
  newWord.user_id = user_id;
  try {
    return await getRepository(SelectedWordsEntity).save(newWord);
  } catch (err) {
    throw new UnprocessableEntityException(err.message);
  }
}

async function CurrentSelectedWord(user_id: string) {
  return await getRepository(SelectedWordsEntity).findOne({
    where: {
      user_id,
    },
    order: {
      id: 'DESC',
    },
  });
}

const CompareWords = (selectedWord: string, userWord: string) => {
  const sameWord = Normalize(selectedWord) === Normalize(userWord);
  if (sameWord) {
    return map(userWord, (letter) => {
      return { letter, value: 1 };
    });
  }
  const userWordArray = split(userWord, '');
  const selectedWordArray = split(selectedWord, '');
  return map(userWordArray, (letter: string, index: number) => {
    let value = 3;
    const isIncluded = find(selectedWordArray, (l: string) => {
      return Normalize(l) === Normalize(letter);
    });
    const isInSite =
      Normalize(nth(selectedWordArray, index)) === Normalize(letter);
    if (isIncluded) {
      value = isInSite ? 1 : 2;
    }
    return { letter, value };
  });
};

const Normalize = function (word: string): string {
  return word.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

async function GetAnsweredWord(answered_word: string) {
  const answeredWordsRepository = getRepository(AnsweredWordsEntity);
  let answeredWord = await answeredWordsRepository.findOne({
    where: {
      word: answered_word,
    },
  });
  if (!answeredWord) {
    const newAnsweredWord = new AnsweredWordsEntity();
    newAnsweredWord.word = answered_word;
    answeredWord = await answeredWordsRepository.save(newAnsweredWord);
  }
  return answeredWord;
}

async function GetLastIntent(
  word_id: string,
  user_id: string,
): Promise<RecordsEntity> {
  const recordsRepository = getRepository(RecordsEntity);
  return await recordsRepository.findOne({
    where: {
      user_id,
      selected_word_id: word_id,
    },
  });
}

const GenerateNewIntent = async (
  word_id: string,
  user_id: string,
  user_word = '',
) => {
  const recordsRepository = getRepository(RecordsEntity);
  const answeredWord: AnsweredWordsEntity = await GetAnsweredWord(user_word);
  let actualRecord: RecordsEntity = await GetLastIntent(word_id, user_id);
  if (!actualRecord) {
    const newRecord = new RecordsEntity();
    newRecord.selected_word_id = word_id;
    newRecord.user_id = user_id;
    newRecord.answered_word_id = answeredWord.uuid;
    newRecord.updated_at = GlobalHelper.getCurrentDateTime();
    actualRecord = await recordsRepository.save(newRecord);
  }
  actualRecord.intents_count += 1;
  return recordsRepository.update(actualRecord.id, actualRecord);
};

export {
  CompareWords,
  CurrentSelectedWord,
  GenerateNewIntent,
  GetLastIntent,
  GetRandomWord,
  Normalize,
  RenewSelectedWord,
};
