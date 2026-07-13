import { LitElement, html } from 'lit';
import { qrCodeReaderBksStyles } from './qr-code-reader-bks-styles.js';

export class QrCodeReaderBks extends LitElement {
  static styles = [qrCodeReaderBksStyles];

  render() {
    return html`<h1>inside qr-code-reader</h1>`;
  }
}

customElements.define('qr-code-reader-bks', QrCodeReaderBks);
