import { LitElement, html } from 'lit';
import { scanQrcodeView } from './scan-qrcode-view-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import '../../features/scanner/barcode-scanner-bks/barcode-scanner-bks.js';
import '../../features/scanner/qr-code-reader-bks/qr-code-reader-bks.js';
import '../../features/scanner/barecode-reader-bks/barecode-reader-bks.js';

export class ScanQrcodeView extends LitElement {
  static styles = [sharedStyles, scanQrcodeView];

  static properties = {
    _detectedType: { type: String, state: true },
    _scannedCode: { type: String, state: true },
  };

  constructor() {
    super();
    this._detectedType = null;
    this._scannedCode = null;
  }

  _handleScanResult(e) {
    this._detectedType = e.detail.type;
    this._scannedCode = e.detail.code;
  }

  _resetScan() {
    this._detectedType = null;
    this._scannedCode = null;
  }

  render() {
    if (this._detectedType === 'QR_CODE') {
      return html`<qr-code-reader-bks></qr-code-reader-bks>`;
    }

    if (this._detectedType === 'BARCODE') {
      console.log(this._scannedCode);
      
      return html`<barecode-reader-bks
        isbn=${this._scannedCode}
        @scan-done=${this._resetScan}
      ></barecode-reader-bks>`;
    }

    return html`
      <div class="header">
        <h1>Scan a book</h1>
        <p>
          Scan a QR code to operate on an existing copy or scan a book barcode
          to add it to the library
        </p>
      </div>
      <barcode-scanner-bks
        @sendBarecode=${this._handleScanResult}
      ></barcode-scanner-bks>
    `;
  }
}

customElements.define('scan-qrcode-view', ScanQrcodeView);
