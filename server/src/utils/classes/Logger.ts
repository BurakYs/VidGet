import { ILogObj, ILogObjMeta, Logger } from 'tslog';
import loggerSettings from '@/config/logger';

export default class CustomLogger extends Logger<ILogObj> {
  constructor() {
    super(loggerSettings);
  }

  /**
   * Logs an HTTP request.
   * @param args - Multiple log attributes that should be logged.
   * @return LogObject with meta property, when log level is >= minLevel
   */
  public logRequest(...args: unknown[]): (ILogObj & ILogObjMeta) | undefined {
    return super.log(6, 'REQUEST', ...args);
  }
}
