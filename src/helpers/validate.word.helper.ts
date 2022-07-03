import axios from 'axios';
import {
  filter,
  find,
  get,
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
      console.log('error1:');
      fs.mkdirSync(PATH, { recursive: true });
    }
    fs.writeFileSync(path.join('/', PATH, FILE), JSON.stringify({ data }));
    console.log(files);
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

const RenewSelectedWord = async () => {
  const newWord = new SelectedWordsEntity();
  newWord.word = await GetRandomWord();
  try {
    await getRepository(SelectedWordsEntity).save(newWord);
  } catch (err) {
    throw new UnprocessableEntityException(err.message);
  }
};

const CurrentSelectedWord = async () => {
  return await getRepository(SelectedWordsEntity).findOne({
    order: {
      id: 'DESC',
    },
  });
};

const CompareWords = (selectedWord: string, userWord: string) => {
  const intent = 1;
  // @ToDo send intent
  const sameWord = Normalize(selectedWord) === Normalize(userWord);
  if (sameWord) {
    // correct answer
    // save record
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

export {
  GetRandomWord,
  CurrentSelectedWord,
  RenewSelectedWord,
  CompareWords,
  Normalize,
};
