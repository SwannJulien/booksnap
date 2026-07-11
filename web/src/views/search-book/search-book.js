import { Router } from '@vaadin/router';
import { LitElement, html } from 'lit';

import '../../components/barecode-scanner/barecode-scanner.js';
import '../save-book/save-book.js';
import '../../components/button-bks/button-bks.js';
import { searchBook } from './search-book-styles.js';
import { postBook } from '../../api/book.js';

export class SearchBook extends LitElement {
  static styles = [searchBook];

  static properties = {
    book: { type: Object },
    isbn: { type: String },
    activeTab: { type: String },
  };

  constructor() {
    super();
    this.book = null;
    this.isbn = '';
    this.activeTab = 'scan';
  }

  async handleBareCodeScanned(event) {
    this.isbn = event.detail.code ? event.detail.code.trim() : this.isbn.trim();
    if (this.isbn) {
      Router.go(`/book?isbn=${this.isbn}`);
    }
  }

  handleInputChange(event) {
    this.isbn = event.target.value;
  }

  render() {
    return html`
      <div class="tabs">${this.tabsTpl}</div>
      <div class="tab-content">${this.tabContentTpl}</div>
    `;
  }

  get tabsTpl() {
    return html`  
        <button
          class=${this.activeTab === 'scan' ? 'active' : ''}
          @click=${() => {
            this.activeTab = 'scan';
          }}
        >
          Scan Barcode
        </button>
        <button
          class=${this.activeTab === 'isbn' ? 'active' : ''}
          @click=${() => {
            this.activeTab = 'isbn';
          }}
        >
          Enter ISBN
        </button>
        <button
          class=${this.activeTab === 'form' ? 'active' : ''}
          @click=${() => {
            this.activeTab = 'form';
          }}
        >
          Fill Form
        </button>
      </div>`;
  }

  get tabContentTpl() {
    switch (this.activeTab) {
      case 'scan':
        return this.scanTabTpl;
      case 'isbn':
        return this.isbnTabTpl;
      case 'form':
        return this.formTabTpl;
      default:
        return this.scanTabTpl;
    }
  }

  get scanTabTpl() {
    return html`
      <div class="scan-tab">
        <h2>Scan your book's barecode to get its details automatically</h2>
        <barecode-scanner
          @sendBarecode=${this.handleBareCodeScanned}
        ></barecode-scanner>
      </div>
    `;
  }

  get isbnTabTpl() {
    return html`
      <div class="isbn-tab">
        <h2>Enter your book's ISBN here to get its details automatically</h2>
        <div class="input-field">
          <input
            type="text"
            id="isbnInput"
            placeholder="Enter ISBN here"
            .value=${this.isbn}
            @input=${this.handleInputChange}
          />
          <button-bks label="Submit ISBN"> </button-bks>
        </div>
      </div>
    `;
  }

  get formTabTpl() {
    return html`
      <div class="form-tab">
        <h2>Fill in the book details</h2>
        <form @submit=${this.handleFormSubmit}>
          <label for="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Book title"
            pattern="^[A-Za-z0-9&#92;s&#92;-:',.!?&amp;&#92;(&#92;)]{1,255}$"
            required
          />

          <label for="author">Author</label>
          <input
            id="author"
            type="text"
            name="author"
            placeholder="Comma separated authors"
            pattern="^[\\p{L}\\p{M}\\s\\-.'\\(\\),]{1,500}$"
            required
          />

          <label for="publishingYear">Publish Year</label>
          <input
            id="publishingYear"
            type="number"
            name="publishingYear"
            placeholder="e.g., 2021"
            min="1000"
            max="${new Date().getFullYear()}"
          />

          <label for="publisher">Publisher</label>
          <input
            id="publisher"
            type="text"
            name="publisher"
            placeholder="Publisher name"
            pattern="^[&#92;p{L}&#92;p{N}&#92;s&#92;-:',.!?&amp;&#92;(&#92;)]{1,255}$"
          />

          <label for="isbn">ISBN</label>
          <input
            id="isbn"
            type="text"
            name="isbn"
            placeholder="ISBN 10 or ISBN 13"
            minlength="10"
            maxlength="13"
            pattern="\\d{10}(\\d{3})?"
            required
          />

          <label for="isFiction">Book type</label>
          <select id="type" name="isFiction" required>
            <option value="" disabled selected hidden>Select book type</option>
            <option value="true">Fiction</option>
            <option value="false">Non-fiction</option>
          </select>

          <label for="numberOfPages">Number of pages</label>
          <input
            id="numberOfPages"
            type="number"
            name="numberOfPages"
            placeholder="e.g., 350"
            min="1"
            max="99999"
          />

          <label for="yearRecommendation">Year recommendation</label>
          <select id="yearRecommendation" name="yearRecommendation">
            <option value="" disabled selected hidden>
              Select age recommendation
            </option>
            <option value="pre school">Pre-school</option>
            <option value="1">year 1</option>
            <option value="2">year 2</option>
            <option value="3">year 3</option>
            <option value="4">year 4</option>
            <option value="5">year 5</option>
            <option value="6">year 6</option>
            <option value="7">year 7</option>
            <option value="8">year 8</option>
            <option value="9">year 9</option>
            <option value="10">year 10</option>
            <option value="11">year 11</option>
            <option value="12">year 12</option>
            <option value="13">year 13</option>
          </select>

          <label for="genres">Genres</label>
          <input
            id="genres"
            type="text"
            name="genres"
            placeholder="Comma separated genres"
            pattern="^[\\p{L}\\p{N}\\s\\-',.]{1,500}$"
          />
          <button-bks type="submit" label="Submit"> </button-bks>
        </form>
      </div>
    `;
  }

  // METHODS

  handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const bookData = Object.fromEntries(formData.entries());

    if (bookData.author) {
      bookData.author = bookData.author.split(',').map(a => a.trim());
    }
    if (bookData.genres) {
      bookData.genres = bookData.genres.split(',').map(g => g.trim());
    }
    if (bookData.numberOfPages) {
      bookData.numberOfPages = parseInt(bookData.numberOfPages, 10);
    }
    if (bookData.publishingYear) {
      bookData.publishingYear = parseInt(bookData.publishingYear, 10);
    }
    if (bookData.isbn.length === 10) {
      bookData.isbn10 = bookData.isbn;
      delete bookData.isbn;
    } else if (bookData.isbn.length === 13) {
      bookData.isbn13 = bookData.isbn;
      delete bookData.isbn;
    } else this.bookData.isbn = undefined;

    bookData.libraryId = 1; // Temporary hardcoded library ID

    postBook(bookData);
  }
}

customElements.define('search-book', SearchBook);
