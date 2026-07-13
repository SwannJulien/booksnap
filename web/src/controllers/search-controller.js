import { searchBooks } from '../api/book.js';

export class SearchController {
  query = '';

  genres = '';

  copyStatus = '';

  results = null;

  isSearching = false;

  _debounceTimer = null;

  constructor(host, { onResults } = {}) {
    this._host = host;
    this._onResults = onResults;
    host.addController(this);
  }

  hostDisconnected() {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
  }

  get isActive() {
    return this.query.length >= 3 || !!this.genres || !!this.copyStatus;
  }

  updateQuery(value) {
    this.query = value;
    this._scheduleSearch();
  }

  updateFilters({ genres, copyStatus }) {
    this.genres = genres ?? this.genres;
    this.copyStatus = copyStatus ?? this.copyStatus;
    this._scheduleSearch();
  }

  _scheduleSearch() {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    if (!this.isActive) {
      this.results = null;
      this.isSearching = false;
      this._host.requestUpdate();
      return;
    }

    this._debounceTimer = setTimeout(() => this.performSearch(), 300);
    this._host.requestUpdate();
  }

  async performSearch() {
    this.isSearching = true;
    this._host.requestUpdate();

    try {
      const response = await searchBooks(this.query, {
        genres: this.genres,
        copyStatus: this.copyStatus,
      });
      this.results = {
        results: response.data,
        count: response.page.totalElements,
        query: this.query,
      };
      this._onResults?.(this.results);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Search failed:', err);
      this.results = { results: [], count: 0, query: this.query };
    } finally {
      this.isSearching = false;
      this._host.requestUpdate();
    }
  }
}
