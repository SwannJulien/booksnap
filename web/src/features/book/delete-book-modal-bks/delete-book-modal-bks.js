import { LitElement, html } from 'lit';
import { deleteBookModalBksStyles } from './delete-book-modal-bks-styles.js';
import { deleteBook } from '../../../api/book.js';
import '../../../components/modal-bks/modal-bks.js';

export class DeleteBookModalBks extends LitElement {
  static styles = [deleteBookModalBksStyles];

  static properties = {
    open: { type: Boolean, reflect: true },
    book: { type: Object },
  };

  constructor() {
    super();
    this.open = false;
    this.book = null;
  }

  render() {
    return html`
      <modal-bks ?open=${this.open} @modal-close=${this._handleClose}>
        <div class="delete-modal-content">
          <div class="delete-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <h2>Delete Book?</h2>
          <p>
            Are you sure you want to delete
            <span class="book-title-highlight">'${this.book?.title}'</span>?
          </p>
          <p>This action cannot be undone.</p>
          <p class="delete-warning">
            All ${this.book?.countCopies?.totalNumberOfCopies ?? 0} associated
            copies will be permanently removed from the library system.
          </p>
          <div class="button-container">
            <button class="btn-cancel" @click=${this._handleClose}>
              Cancel
            </button>
            <button class="btn-delete" @click=${this._handleConfirmDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path
                  d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                />
              </svg>
              Delete Book
            </button>
          </div>
        </div>
      </modal-bks>
    `;
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }

  async _handleConfirmDelete() {
    try {
      await deleteBook(this.book.id);

      this.dispatchEvent(
        new CustomEvent('book-deleted', { bubbles: true, composed: true }),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete book:', err);
    }
  }
}

customElements.define('delete-book-modal-bks', DeleteBookModalBks);
