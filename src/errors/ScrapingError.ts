export class ScrapingError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ScrapingError"
  }
}

export default function scrapeError(message?: string): never {
  throw new ScrapingError(message);
}
