import { LitElement, html } from 'lit';
import { barecodeReaderBksStyles } from './barecode-reader-bks-styles.js';
import { searchBooks } from '../../../api/book.js';
import { createCopy, getBookCopies } from '../../../api/copy.js';
import { BookService } from '../../../api/bookService.js';
import '../barcode-scanner-bks/barcode-scanner-bks.js';
import '../../book/book-form-bks/book-form-bks.js';
import '../../book/create-book-bks/create-book-bks.js';
import '../../../components/modal-bks/modal-bks.js';
import '../../../components/button-bks/button-bks.js';
import '../../../components/spinner-bks/spinner-bks.js';

export class BarecodeReaderBks extends LitElement {
  static styles = [barecodeReaderBksStyles];

  static properties = {
    isbn: { type: String },
    _isFetching: { type: Boolean, state: true },
    _modalOpen: { type: Boolean, state: true },
    _modalType: { type: String, state: true },
    _dbBook: { type: Object, state: true },
    _openLibraryBook: { type: Object, state: true },
    _showBookForm: { type: Boolean, state: true },
    _error: { type: String, state: true },
  };

  constructor() {
    super();
    this.isbn = null;
    this._isFetching = false;
    this._modalOpen = false;
    this._modalType = null;
    this._dbBook = null;
    this._openLibraryBook = null;
    this._showBookForm = false;
    this._error = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('isbn') && this.isbn) {
      this._checkIsbn(this.isbn);
    }
  }

  render() {
    return html`
      ${this._renderContent()}
      <modal-bks ?open=${this._modalOpen} @modal-close=${this._closeModal}>
        ${this._renderModalContent()}
      </modal-bks>
      <create-book-bks
        @book-created=${this._handleBookCreated}
      ></create-book-bks>
    `;
  }

  _renderContent() {
    if (this._showBookForm) {
      return html`
        <h2>
          ${this._openLibraryBook
            ? 'Review the book details and make any necessary corrections before submit'
            : 'Loading book details...'}
        </h2>
        ${this._isFetching
          ? html`<spinner-bks></spinner-bks>`
          : html`
              <book-form-bks
                .book=${this._openLibraryBook}
                @book-submit=${this._handleBookSubmit}
              ></book-form-bks>
            `}
      `;
    }

    if (this.isbn) {
      return this._isFetching ? html`<spinner-bks></spinner-bks>` : html``;
    }

    return html`
      ${this._isFetching
        ? html`<spinner-bks></spinner-bks>`
        : html`
            <barcode-scanner-bks
              @sendBarecode=${this._handleScan}
            ></barcode-scanner-bks>
          `}
    `;
  }

  _renderModalContent() {
    switch (this._modalType) {
      case 'not-in-library':
        return this._renderNotInLibraryContent();
      case 'already-exists':
        return this._renderAlreadyExistsContent();
      case 'copy-success':
        return this._renderCopySuccessContent();
      case 'error':
        return html`
          <div class="modal-body-content">
            <h2>Error</h2>
            <p class="error-message">${this._error}</p>
          </div>
        `;
      default:
        return html``;
    }
  }

  _renderNotInLibraryContent() {
    return html`
      <div class="modal-body-content">
        <h2>Book not found</h2>
        <p>
          This book doesn't seem to be in your library. Do you want to add it?
        </p>
        <div class="button-container">
          <button-bks
            label="Yes"
            @button-click=${this._handleAddNewBook}
          ></button-bks>
          <button-bks label="No" @button-click=${this._closeModal}></button-bks>
        </div>
      </div>
    `;
  }

  _renderCopySuccessContent() {
    return html`
      <div class="modal-body-content">
        <h2>Copy successfully created!</h2>
        <p>${this._dbBook?.title}</p>
      </div>
    `;
  }

  _renderAlreadyExistsContent() {
    const authors = Array.isArray(this._dbBook?.authors)
      ? this._dbBook.authors.join(', ')
      : this._dbBook?.authors || '';

    return html`
      <div class="modal-body-content">
        <h2>${this._dbBook?.title}</h2>
        <p class="book-authors">${authors}</p>
        <p>
          This book already exists in your library. Do you want to add a new
          copy?
        </p>
        <div class="button-container">
          <button-bks
            label="Yes"
            @button-click=${this._handleCreateCopy}
          ></button-bks>
          <button-bks label="No" @button-click=${this._closeModal}></button-bks>
        </div>
      </div>
    `;
  }

  _handleScan(e) {
    this._checkIsbn(e.detail.code);
  }

  async _checkIsbn(isbnValue) {
    this._isFetching = true;
    this._dbBook = null;

    try {
      const response = await searchBooks(isbnValue);
      const books = response.data || [];

      if (books.length > 0) {
        [this._dbBook] = books;
        this._modalType = 'already-exists';
      } else {
        this._modalType = 'not-in-library';
      }

      this._modalOpen = true;
    } catch (err) {
      this._error =
        err.message || 'An error occurred while checking the library.';
      this._modalType = 'error';
      this._modalOpen = true;
    } finally {
      this._isFetching = false;
    }
  }

  async _handleAddNewBook() {
    this._modalOpen = false;
    this._isFetching = true;
    this._showBookForm = true;

    try {
      this._openLibraryBook = await BookService.fetchByIsbn(this.isbn);
    } catch (err) {
      this._error = 'Could not fetch book details from OpenLibrary.';
      this._modalType = 'error';
      this._modalOpen = true;
      this._showBookForm = false;
    } finally {
      this._isFetching = false;
    }
  }

  async _handleCreateCopy() {
    this._modalOpen = false;
    this._isFetching = true;

    try {
      const copies = await getBookCopies(this._dbBook.id);
      const sectionName = copies?.data?.[0]?.section?.name;

      await createCopy({
        bookId: this._dbBook.id,
        libraryId: 1,
        sectionName,
        status: 'available',
      });

      this._modalType = 'copy-success';
      this._modalOpen = true;
    } catch (err) {
      this._error = err.message || 'Failed to create copy.';
      this._modalType = 'error';
      this._modalOpen = true;
    } finally {
      this._isFetching = false;
    }
  }

  async _handleBookSubmit(e) {
    const { bookData, cover } = e.detail;
    this._isFetching = true;

    try {
      await this.shadowRoot
        .querySelector('create-book-bks')
        .submitBook(bookData, cover);
    } finally {
      this._isFetching = false;
    }
  }

  _handleBookCreated() {
    this._showBookForm = false;
    this._openLibraryBook = null;
    this._dispatchScanDone();
  }

  _closeModal() {
    this._modalOpen = false;
    this._dispatchScanDone();
  }

  _dispatchScanDone() {
    this.dispatchEvent(
      new CustomEvent('scan-done', { bubbles: true, composed: true }),
    );
  }
}

customElements.define('barecode-reader-bks', BarecodeReaderBks);
