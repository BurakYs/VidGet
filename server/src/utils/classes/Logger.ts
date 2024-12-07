import { type ILogObj, Logger } from 'tslog';
import loggerConfig from '@/config/logger';

export default class CustomLogger extends Logger<ILogObj> {
  constructor() {
    super(loggerConfig);
  }
}