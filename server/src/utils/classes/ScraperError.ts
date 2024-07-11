import type { Translatable } from '@/interfaces/Response';

export default class ScraperError {
  code: Translatable['code'];
  message: Translatable['message'];
  variables?: Translatable['variables'];

  constructor(data: Translatable) {
    this.code = data.code;
    this.message = data.message;
    this.variables = data.variables;
  }
}