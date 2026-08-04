import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { LitElement, html } from 'lit';
import { barcodeScannerBksStyles } from './barcode-scanner-bks-styles.js';
import '../../../components/button-bks/button-bks.js';

// Telling ZXing which symbologies to expect stops it running every reader
// (1D, QR, Micro QR, Data Matrix, Aztec, PDF417, MaxiCode) on every frame.
const FORMATS_BY_MODE = {
  qr: [BarcodeFormat.QR_CODE],
  // Book barcodes are EAN-13 (ISBN-13); the others cover older/short editions.
  barcode: [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ],
};

// The library defaults to 500ms, i.e. two decode attempts per second. A QR code
// is usually read on the first attempt, a 1D barcode is not, so that default is
// what makes barcode scanning feel slow.
const DELAY_BETWEEN_SCAN_ATTEMPTS = 100;

export class BarcodeScannerBks extends LitElement {
  static styles = [barcodeScannerBksStyles];

  static properties = {
    result: { type: String },
    hideVideo: { type: Boolean },
    isScanning: { type: Boolean },
    autoStart: { type: Boolean },
    mode: { type: String },
  };

  constructor() {
    super();
    this.result = '';
    this.codeReader = null;
    this.hideVideo = true;
    this.isScanning = false;
    this.videoStream = null;
    this.autoStart = false;
    this.mode = 'all';
  }

  // Built on start rather than in the constructor so `mode` is already set from
  // the attribute by the time the hints are decided.
  createCodeReader() {
    const hints = new Map();
    const formats = FORMATS_BY_MODE[this.mode];

    if (formats) {
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    }

    // Without this a 1D reader only samples 25 scan lines around the middle of
    // the frame, and never retries the frame rotated, so the barcode has to be
    // held both centred and level to be seen.
    if (this.mode === 'barcode') {
      hints.set(DecodeHintType.TRY_HARDER, true);
    }

    return new BrowserMultiFormatReader(hints, {
      delayBetweenScanAttempts: DELAY_BETWEEN_SCAN_ATTEMPTS,
    });
  }

  firstUpdated() {
    if (this.autoStart) {
      this.startScanner();
    }
  }

  async toggleScanner() {
    if (this.isScanning) {
      this.stopScanner();
    } else {
      await this.startScanner();
    }
  }

  async startScanner() {
    try {
      const videoElement = this.shadowRoot.getElementById('video');

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
          advanced: [{ focusMode: 'continuous' }],
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoStream = stream;
      this.hideVideo = false;
      this.isScanning = true;
      videoElement.srcObject = stream;

      this.codeReader = this.createCodeReader();
      this.codeReader.decodeFromStream(
        stream,
        videoElement,
        (result, err, control) => {
          if (result) {
            this.result = result.getText();
            const type =
              result.getBarcodeFormat() === BarcodeFormat.QR_CODE
                ? 'QR_CODE'
                : 'BARCODE';
            this.dispatchEvent(
              new CustomEvent('sendBarcode', {
                bubbles: true,
                composed: true,
                detail: { code: this.result, type },
              }),
            );
            control.stop();
            this.stopScanner();
          }
        },
      );
    } catch (err) {
      // console.error('QR Scanner error:', err);
    }
  }

  stopScanner() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }

    const video = this.shadowRoot.getElementById('video');
    if (video) {
      video.srcObject = null;
    }

    this.hideVideo = true;
    this.isScanning = false;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopScanner();
  }

  render() {
    return html`
      <video id="video" autoplay muted ?hidden=${this.hideVideo}></video>
      ${this.autoStart
        ? ''
        : html`<button-bks
            label=${this.isScanning ? 'Stop Scanning' : 'Start Scanning'}
            @click=${this.toggleScanner}
          >
          </button-bks>`}
    `;
  }
}

customElements.define('barcode-scanner-bks', BarcodeScannerBks);
