import axios from 'axios';
import { isEmpty, split } from 'lodash';

const WORD_LIST_URL = 'https://gitlab.com/d2945/words/-/raw/main/words.txt';
const WORD_LIST = [];
const GetStoredWordList = async (): Promise<string[]> => {
  if (isEmpty(WORD_LIST)) {
    const { data } = await axios.get(WORD_LIST_URL, {
      headers: {
        'Content-Type': 'text/text; charset=UTF-8',
      },
      transformResponse: (data) => {
        return split(data, '\n');
      },
    });
    return data;
  }
  return WORD_LIST;
};
const StoreWordList = async (): Promise<void> => {
  const path = '';
};
const RenewWord = () => {
  console.log();
};

export { GetStoredWordList, RenewWord };
