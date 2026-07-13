import { LitElement, html } from 'lit';
import { createBookBksStyles } from './create-book-bks-styles.js';
import { BookService } from '../../../api/bookService.js';
import { createCopy } from '../../../api/copy.js';
import '../../../components/modal-bks/modal-bks.js';
import '../../../components/button-bks/button-bks.js';

export class CreateBookBks extends LitElement {
  static styles = [createBookBksStyles];

  static properties = {
    _modalOpen: { type: Boolean, state: true },
    _modalType: { type: String, state: true },
    _modalData: { type: Object, state: true },
    _sectionName: { type: String, state: true },
    _bookTitle: { type: String, state: true },
  };

  constructor() {
    super();
    this._modalOpen = false;
    this._modalType = null;
    this._modalData = null;
    this._sectionName = '';
    this._bookTitle = '';
  }

  render() {
    return html`
      <modal-bks ?open=${this._modalOpen} @modal-close=${this._closeModal}>
        ${this._renderModalContent()}
      </modal-bks>
    `;
  }

  async submitBook(bookData, cover) {
    try {
      const response = await BookService.createBook(bookData, cover);
      this._bookTitle = bookData.title || '';

      if (response.status === 201) {
        this._modalType = 'success';
        this._modalData = response.body;
        this._dispatchBookCreated();
      } else if (response.status === 409) {
        this._modalType = 'conflict';
        this._modalData = response.body;
        this._sectionName = bookData.sectionName;
      } else {
        this._modalType = 'error';
        this._modalData = response.body;
      }
    } catch (err) {
      this._modalType = 'error';
      this._modalData = { message: err.message || 'An error occurred' };
    } finally {
      this._modalOpen = true;
    }
  }

  showError(message) {
    this._modalType = 'error';
    this._modalData = { message };
    this._modalOpen = true;
  }

  _renderModalContent() {
    switch (this._modalType) {
      case 'success':
        return this._renderSuccessContent();
      case 'conflict':
        return this._renderConflictContent();
      case 'error':
        return this._renderErrorContent();
      default:
        return html``;
    }
  }

  _renderSuccessContent() {
    return html`
      <div class="modal-success">
        <h2>Book successfully created!</h2>
        <img
          src="data:image/png;base64,${this._modalData?.qrCode}"
          alt="QR Code"
          class="qr-code"
        />
        <p>${this._bookTitle}</p>
        <p>${this._modalData?.identificationCode}</p>
        <button-bks
          class="print-btn"
          label="Print QR Code"
          @click=${this._handlePrint}
        ></button-bks>
      </div>
    `;
  }

  _renderConflictContent() {
    return html`
      <div class="modal-conflict">
        <h2>Book already in store</h2>
        <p>Do you want to create new copy?</p>
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

  _renderErrorContent() {
    return html`
      <div class="modal-error">
        <h2>Error</h2>
        <p class="error-message">${this._modalData?.message}</p>
      </div>
    `;
  }

  async _handleCreateCopy() {
    const payload = {
      bookId: this._modalData.bookId,
      libraryId: 1, // TODO: remove the hardcoded libraryID
      sectionName: this._sectionName,
      status: 'available',
    };

    try {
      const response = await createCopy(payload);
      this._modalData = response;
      this._modalType = 'success';
      this._dispatchBookCreated();
    } catch (error) {
      this._modalData = { message: error.message };
      this._modalType = 'error';
    }
  }

  _handlePrint() {
    window.print();
  }

  _closeModal() {
    this._modalOpen = false;
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }

  _dispatchBookCreated() {
    this.dispatchEvent(
      new CustomEvent('book-created', { bubbles: true, composed: true }),
    );
  }
}

customElements.define('create-book-bks', CreateBookBks);
