import { LitElement, html } from 'lit';
import { scanQrcodeView } from './scan-qrcode-view-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import { getBorrowingByCopyId } from '../../api/borrowing.js';
import '../../features/scanner/barcode-scanner-bks/barcode-scanner-bks.js';

export class ScanQrcodeView extends LitElement {
  static styles = [sharedStyles, scanQrcodeView];

  static properties = {
    _scannedCode: { type: String, state: true },
    _copyId: { type: String, state: true }
  };

  constructor() {
    super();
    this._scannedCode = null;
    this._copyId = null;
  }

  _handleScanResult(e) {
    this._scannedCode = e.detail.code;
    this._copyId = this._extractCopyId(this._scannedCode);

    if (this._copyId) {
      this._checkBorrowing(this._copyId);
    } else {
      console.log(`Unrecognized QR code: ${this._scannedCode}`);
    }
  }

  // QR content format: COPY:{copyId}:LIB:{libraryId}:BOOK:{bookId}:CHK:{checksum}
  _extractCopyId(code) {
    const parts = code?.split(':') ?? [];
    if (parts[0] === 'COPY' && parts[1]) {
      return parts[1];
    }
    return null;
  }

  async _checkBorrowing(copyId) {
    try {
      const result = await getBorrowingByCopyId(copyId);
      if (!result) {
        console.log(`Copy ${copyId} not found`);
        return;
      }
      if (result.borrowing) {
        console.log(`Copy ${copyId} is borrowed (status: ${result.copyStatus})`, result.borrowing);
      } else {
        console.log(`Copy ${copyId} is not borrowed (status: ${result.copyStatus})`);
      }
    } catch (error) {
      console.error(`Failed to check borrowing for copy ${copyId}:`, error);
    }
  }

  render() {
    return html`
      <barcode-scanner-bks
        autoStart
        @sendBarecode=${this._handleScanResult}
      ></barcode-scanner-bks>
    `;
  }
}

customElements.define('scan-qrcode-view', ScanQrcodeView);
