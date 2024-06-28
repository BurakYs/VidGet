export default class ScraperError extends Error {
  constructor(...message: unknown[]) {
    super(message.join(' '));
  }
}
