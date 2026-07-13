import { LitElement, html } from 'lit';
import { deleteCopyModalBksStyles } from './delete-copy-modal-bks-styles.js';
import { deleteCopy } from '../../../api/copy.js';
import '../../../components/modal-bks/modal-bks.js';

export class DeleteCopyModalBks extends LitElement {
  static styles = [deleteCopyModalBksStyles];

  static properties = {
    open: { type: Boolean, reflect: true },
    copy: { type: Object },
  };

  constructor() {
    super();
    this.open = false;
    this.copy = null;
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
          <h2>Delete Copy?</h2>
          <p>
            Are you sure you want to delete this copy? This action cannot be
            undone.
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
              Delete Copy
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
      await deleteCopy(this.copy.id);

      this.dispatchEvent(
        new CustomEvent('copy-deleted', {
          bubbles: true,
          composed: true,
          detail: { bookId: this.copy.bookId },
        }),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete copy:', err);
    }
  }
}

customElements.define('delete-copy-modal-bks', DeleteCopyModalBks);
