import { getCover } from '../api/cover.js';

export class CoverController {
  /** @type {Map<string, string | null>} isbn → objectURL | 'loading' | null */
  urls = new Map();

  constructor(host) {
    this._host = host;
    host.addController(this);
  }

  hostDisconnected() {
    this.urls.forEach(url => {
      if (url && url !== 'loading') {
        URL.revokeObjectURL(url);
      }
    });
    this.urls.clear();
  }

  fetchForBooks(books) {
    if (!books) return;

    books.forEach(book => {
      const isbn = book.isbn13 || book.isbn10;
      if (isbn && !this.urls.has(isbn)) {
        this._fetchCover(isbn);
      }
    });
  }

  get(isbn) {
    const url = this.urls.get(isbn);
    return url && url !== 'loading' ? url : null;
  }

  async _fetchCover(isbn) {
    if (this.urls.has(isbn)) return;

    this.urls.set(isbn, 'loading');

    try {
      const { blob } = await getCover(isbn);
      const url = URL.createObjectURL(blob);
      this.urls.set(isbn, url);
    } catch {
      this.urls.set(isbn, null);
    }
    this._host.requestUpdate();
  }
}
