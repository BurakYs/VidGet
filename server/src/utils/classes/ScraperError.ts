type ErrorMessage = unknown;

export default class ScraperError {
  message: ErrorMessage;

  constructor(message: ErrorMessage) {
    this.message = message;
  }
}