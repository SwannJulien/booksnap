import { LitElement, html } from 'lit';
import { searchBarBksStyles } from './search-bar-bks-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import { searchGenres } from '../../api/genre.js';
import { getCopyStatuses } from '../../api/copy.js';

export class SearchBarBks extends LitElement {
  static styles = [searchBarBksStyles, sharedStyles];

  static properties = {
    query: { type: String },
    _genreQuery: { type: String, state: true },
    _genreOptions: { type: Array, state: true },
    _genreOpen: { type: Boolean, state: true },
    _selectedGenre: { type: String, state: true },
    _statuses: { type: Array, state: true },
    _selectedStatus: { type: String, state: true },
  };

  constructor() {
    super();
    this.query = '';
    this._genreQuery = '';
    this._genreOptions = [];
    this._genreOpen = false;
    this._selectedGenre = '';
    this._statuses = [];
    this._selectedStatus = '';
    this._genreDebounceTimer = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._fetchStatuses();
  }

  async _fetchStatuses() {
    try {
      this._statuses = await getCopyStatuses();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch statuses:', err);
    }
  }

  render() {
    return html`
      <div class="searchbar-container">
        <div class="searchbar-search">
          <input
            name="search"
            type="search"
            placeholder="Search by title, author, or ISBN..."
            .value=${this.query}
            @input=${this._handleInput}
          />
        </div>
        <div class="searchbar-genres">
          <div class="genre-autocomplete">
            <input
              name="genre"
              type="text"
              placeholder="Search genre..."
              .value=${this._genreQuery}
              @input=${this._handleGenreInput}
              @focus=${() => {
                if (this._genreOptions.length) this._genreOpen = true;
              }}
            />
            ${this._selectedGenre
              ? html`<button
                  class="genre-clear"
                  @click=${this._clearGenre}
                  aria-label="Clear genre"
                >
                  &times;
                </button>`
              : ''}
            ${this._genreOpen && this._genreOptions.length
              ? html`
                  <ul class="genre-dropdown">
                    ${this._genreOptions.map(
                      genre => html`
                        <li
                          tabindex="0"
                          @click=${() => this._selectGenre(genre)}
                          @keydown=${e => {
                            if (e.key === 'Enter') this._selectGenre(genre);
                          }}
                        >
                          ${genre}
                        </li>
                      `,
                    )}
                  </ul>
                `
              : ''}
          </div>
        </div>
        <div class="searchbar-filter-availability">
          <div class="availability-wrapper">
            <select name="availability" @change=${this._handleStatusChange}>
              <option value="" disabled selected hidden>Availability</option>
              ${this._statuses.map(
                status => html`
                  <option
                    value=${status}
                    ?selected=${this._selectedStatus === status}
                  >
                    ${status.charAt(0).toUpperCase() +
                    status.slice(1).replace('_', ' ')}
                  </option>
                `,
              )}
            </select>
            ${this._selectedStatus
              ? html`<button
                  class="availability-clear"
                  @click=${this._clearStatus}
                  aria-label="Clear availability"
                >
                  &times;
                </button>`
              : ''}
          </div>
        </div>
        <div class="searchbar-filter-more">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#9CA3AF"
            >
              <path
                d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"
              />
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  _handleInput(e) {
    this.dispatchEvent(
      new CustomEvent('search-input', {
        detail: { value: e.target.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleGenreInput(e) {
    const { value } = e.target;
    this._genreQuery = value;
    this._selectedGenre = '';

    if (this._genreDebounceTimer) {
      clearTimeout(this._genreDebounceTimer);
    }

    if (value.length < 3) {
      this._genreOptions = [];
      this._genreOpen = false;
      this._dispatchFiltersChanged();
      return;
    }

    this._genreDebounceTimer = setTimeout(() => this._searchGenres(value), 300);
  }

  async _searchGenres(query) {
    try {
      const results = await searchGenres(query);
      this._genreOptions = results;
      this._genreOpen = results.length > 0;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Genre search failed:', err);
      this._genreOptions = [];
      this._genreOpen = false;
    }
  }

  _selectGenre(genre) {
    this._selectedGenre = genre;
    this._genreQuery = genre;
    this._genreOpen = false;
    this._genreOptions = [];
    this._dispatchFiltersChanged();
  }

  _clearGenre() {
    this._selectedGenre = '';
    this._genreQuery = '';
    this._genreOptions = [];
    this._genreOpen = false;
    this._dispatchFiltersChanged();
  }

  _handleStatusChange(e) {
    this._selectedStatus = e.target.value;
    this._dispatchFiltersChanged();
  }

  _clearStatus() {
    this._selectedStatus = '';
    const select = this.shadowRoot.querySelector('select[name="availability"]');
    select.selectedIndex = 0;
    this._dispatchFiltersChanged();
  }

  _dispatchFiltersChanged() {
    this.dispatchEvent(
      new CustomEvent('filters-changed', {
        detail: {
          genres: this._selectedGenre,
          copyStatus: this._selectedStatus,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('search-bar-bks', SearchBarBks);
