import { LitElement, html } from 'lit';
import { modalBksStyles } from './modal-bks-styles.js';

export class ModalBks extends LitElement {
  static styles = [modalBksStyles];

  static properties = {
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.open = false;
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  render() {
    return html`
      <div class="modal-overlay" ?hidden=${!this.open}>
        <div
          class="modal-backdrop"
          @click=${this._handleClose}
          aria-hidden="true"
        ></div>
        <div
          class="modal-content"
          role="dialog"
          aria-modal="true"
          aria-label="Modal"
        >
          <button
            class="close-btn"
            type="button"
            aria-label="Close modal"
            @click=${this._handleClose}
          >
            &times;
          </button>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  _handleKeyDown(e) {
    if (this.open && e.key === 'Escape') {
      this._handleClose();
    }
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }
}

customElements.define('modal-bks', ModalBks);
