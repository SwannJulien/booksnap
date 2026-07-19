import { LitElement, html } from 'lit';
import { scanQrcodeView } from './scan-qrcode-view-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import { getBorrowingByCopyId } from '../../api/borrowing.js';
import '../../features/scanner/barcode-scanner-bks/barcode-scanner-bks.js';
import '../../features/borrowing/loan-modal-bks/loan-modal-bks.js';

// QR content format: COPY:{copyId}:LIB:{libraryId}:BOOK:{bookId}:CHK:{checksum}
function extractCopyId(code) {
  const parts = code?.split(':') ?? [];
  if (parts[0] === 'COPY' && parts[1]) {
    return parts[1];
  }
  return null;
}

export class ScanQrcodeView extends LitElement {
  static styles = [sharedStyles, scanQrcodeView];

  static properties = {
    _scannedCode: { type: String, state: true },
    _copyId: { type: String, state: true },
    _availableCopy: { type: Object, state: true },
  };

  constructor() {
    super();
    this._scannedCode = null;
    this._copyId = null;
    this._availableCopy = null;
  }

  _handleScanResult(e) {
    this._scannedCode = e.detail.code;
    this._copyId = extractCopyId(this._scannedCode);

    if (this._copyId) {
      this._checkBorrowing(this._copyId);
    } else {
      console.log(`Unrecognized QR code: ${this._scannedCode}`);
    }
  }

  async _checkBorrowing(copyId) {
    try {
      const result = await getBorrowingByCopyId(copyId);
      if (!result) {
        console.log(`Copy ${copyId} not found`);
        return;
      }
      if (result.borrowing) {
        console.log(
          `Copy ${copyId} is borrowed (status: ${result.copyStatus})`,
          result.borrowing,
        );
      } else if (result.copyStatus === 'available') {
        this._availableCopy = { copyId, bookTitle: result.bookTitle };
      } else {
        console.log(
          `Copy ${copyId} is not borrowed (status: ${result.copyStatus})`,
        );
      }
    } catch (error) {
      console.error(`Failed to check borrowing for copy ${copyId}:`, error);
    }
  }

  _handleLoanModalClose() {
    this._availableCopy = null;
  }

  render() {
    return html`
      <barcode-scanner-bks
        autoStart
        @sendBarecode=${this._handleScanResult}
      ></barcode-scanner-bks>
      <loan-modal-bks
        ?open=${!!this._availableCopy}
        .copyId=${this._availableCopy?.copyId}
        .bookTitle=${this._availableCopy?.bookTitle}
        @modal-close=${this._handleLoanModalClose}
      ></loan-modal-bks>
    `;
  }
}

customElements.define('scan-qrcode-view', ScanQrcodeView);
