import Redis from 'ioredis';
import { __prod__ } from '@constants/env';

const errorType = 'READONLY';

export const redis = new Redis({
  host: __prod__ ? 'redis' : '127.0.0.1',
  port: 6379,
  reconnectOnError(error: Error) {
    const targetError = errorType;
    if (error.message.includes(targetError)) {
      return true;
    }
  },
});
