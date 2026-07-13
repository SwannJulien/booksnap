import { LitElement, html } from 'lit';
import { copyQrModalBksStyles } from './copy-qr-modal-bks-styles.js';
import { getCopyQrCode } from '../../../api/copy.js';
import '../../../components/modal-bks/modal-bks.js';
import '../../../components/button-bks/button-bks.js';

export class CopyQrModalBks extends LitElement {
  static styles = [copyQrModalBksStyles];

  static properties = {
    open: { type: Boolean, reflect: true },
    copy: { type: Object },
    _qrCode: { type: String, state: true },
  };

  constructor() {
    super();
    this.open = false;
    this.copy = null;
    this._qrCode = null;
  }

  updated(changedProperties) {
    if (changedProperties.has('open') || changedProperties.has('copy')) {
      if (this.open && this.copy) {
        this._fetchQrCode();
      }
      if (!this.open) {
        this._qrCode = null;
      }
    }
  }

  render() {
    return html`
      <modal-bks ?open=${this.open} @modal-close=${this._handleClose}>
        <div class="qr-modal-content">
          ${this._qrCode
            ? html`
                <img
                  src="data:image/png;base64,${this._qrCode}"
                  alt="QR Code"
                  class="qr-code"
                />
                <p>${this.copy?.bookTitle}</p>
                <button-bks
                  class="print-btn"
                  label="Print QR Code"
                  @click=${this._handlePrint}
                ></button-bks>
              `
            : html`<spinner-bks></spinner-bks>`}
        </div>
      </modal-bks>
    `;
  }

  async _fetchQrCode() {
    this._qrCode = null;

    try {
      this._qrCode = await getCopyQrCode(this.copy.id);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch QR code:', err);
      this._handleClose();
    }
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }

  _handlePrint() {
    window.print();
  }
}

customElements.define('copy-qr-modal-bks', CopyQrModalBks);
