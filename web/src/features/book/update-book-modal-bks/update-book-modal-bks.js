import { LitElement, html } from 'lit';
import { updateBookModalBksStyles } from './update-book-modal-bks-styles.js';
import { updateBook } from '../../../api/book.js';
import { mapBookFormData } from '../../../utils/formDataMapper.js';
import '../../../components/modal-bks/modal-bks.js';
import '../book-form-bks/book-form-bks.js';

export class UpdateBookModalBks extends LitElement {
  static styles = [updateBookModalBksStyles];

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
    if (!this.open) return html``;

    return html`
      <modal-bks ?open=${this.open} @modal-close=${this._handleClose}>
        <div class="update-book-modal-content">
          <h2>Update Book</h2>
          <book-form-bks
            mode="update"
            .book=${this.book}
            @book-submit=${this._handleSubmit}
          ></book-form-bks>
        </div>
      </modal-bks>
    `;
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }

  async _handleSubmit(e) {
    const { bookData } = e.detail;
    const mappedData = mapBookFormData(bookData);
    // TODO: remove hardcoded libraryId
    mappedData.libraryId = 1;

    try {
      await updateBook(mappedData.id, mappedData);

      this.dispatchEvent(
        new CustomEvent('book-updated', { bubbles: true, composed: true }),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to update book:', err);
    }
  }
}

customElements.define('update-book-modal-bks', UpdateBookModalBks);
