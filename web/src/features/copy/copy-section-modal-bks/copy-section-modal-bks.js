import { LitElement, html } from 'lit';
import { copySectionModalBksStyles } from './copy-section-modal-bks-styles.js';
import { updateCopy } from '../../../api/copy.js';
import '../../../components/modal-bks/modal-bks.js';

export class CopySectionModalBks extends LitElement {
  static styles = [copySectionModalBksStyles];

  static properties = {
    open: { type: Boolean, reflect: true },
    copy: { type: Object },
    _sectionName: { type: String, state: true },
    _error: { type: String, state: true },
  };

  constructor() {
    super();
    this.open = false;
    this.copy = null;
    this._sectionName = '';
    this._error = '';
  }

  updated(changedProperties) {
    if (changedProperties.has('open') && !this.open) {
      this._sectionName = '';
      this._error = '';
    }
  }

  render() {
    return html`
      <modal-bks ?open=${this.open} @modal-close=${this._handleClose}>
        ${this._formTpl}
      </modal-bks>
    `;
  }

  get _formTpl() {
    return html`
      <div class="update-section-modal-content">
        <h2>Enter the new section for this copy</h2>
        ${this._error
          ? html`<p class="update-section-error">${this._error}</p>`
          : ''}
        <form @submit=${this._handleSubmit}>
          <div class="update-section-form-group">
            <label for="new-section-name">Section</label>
            <input
              id="new-section-name"
              type="text"
              .value=${this._sectionName}
              @input=${e => {
                this._sectionName = e.target.value;
              }}
              placeholder="Enter section name"
              required
            />
          </div>
          <div class="button-container">
            <button
              class="btn-cancel"
              type="button"
              @click=${this._handleClose}
            >
              Cancel
            </button>
            <button class="btn-confirm" type="submit">Submit</button>
          </div>
        </form>
      </div>
    `;
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }

  async _handleSubmit(e) {
    e.preventDefault();

    try {
      await updateCopy(this.copy.id, {
        sectionName: this._sectionName,
      });

      this.dispatchEvent(
        new CustomEvent('section-updated', {
          bubbles: true,
          composed: true,
          detail: {
            id: this.copy.id,
            bookId: this.copy.bookId,
            bookTitle: this.copy.bookTitle,
          },
        }),
      );
    } catch (err) {
      this._error = err.message;
    }
  }
}

customElements.define('copy-section-modal-bks', CopySectionModalBks);
