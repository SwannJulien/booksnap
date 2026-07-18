import { LitElement, html } from 'lit';
import { scanQrcodeView } from './scan-qrcode-view-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import '../../features/scanner/barcode-scanner-bks/barcode-scanner-bks.js';

export class ScanQrcodeView extends LitElement {
  static styles = [sharedStyles, scanQrcodeView];

  static properties = {
    _scannedCode: { type: String, state: true }
  };

  constructor() {
    super();
    this._scannedCode = null;
  }

  _handleScanResult(e) {
    this._scannedCode = e.detail.code;
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
