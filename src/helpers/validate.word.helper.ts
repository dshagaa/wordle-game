import axios from 'axios';
import { get, isEmpty, split } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

const WORD_LIST_URL = 'https://gitlab.com/d2945/words/-/raw/main/words.txt';
let WORD_LIST = [];
const PATH = path.join(
  '/',
  get(process, ['env', 'STORAGE_PATH'], '/tmp/storage'),
);
const FILE = 'word_list.txt';
const GetStoredWordList = async (): Promise<string[]> => {
  WORD_LIST = await ReadStoredWordList();
  if (isEmpty(WORD_LIST)) {
    const { data } = await axios.get(WORD_LIST_URL, {
      headers: {
        'Content-Type': 'text/text; charset=UTF-8',
      },
      transformResponse: (data) => {
        return split(data, '\n');
      },
    });
    await StoreWordList(data);
    WORD_LIST = data;
  }
  return WORD_LIST;
};

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
  const content = fs.readFileSync(path.join('/', PATH, FILE), 'utf8');
  const { data } = JSON.parse(content);
  return data;
}

const RenewWord = () => {
  console.log();
};

export { GetStoredWordList, RenewWord };
