export default class ScraperError extends Error {
    constructor(...message: string[]) {
        super(message.join(' '));
    }
}