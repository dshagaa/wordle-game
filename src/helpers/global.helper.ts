import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import * as CryptoJS from 'crypto-js';

const GlobalHelper = {
  uuid(): string {
    return uuid();
  },
  crypto(value: string) {
    return CryptoJS.SHA256(value).toString();
  },
  getDateTimeFormat(): string {
    return 'yyyy-LL-dd HH:mm:ss';
  },
  getCurrentDateTime(): string {
    return DateTime.now().toUTC().toFormat(this.getDateTimeFormat());
  },
};

export { GlobalHelper };
