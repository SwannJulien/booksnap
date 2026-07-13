import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat } from '@zxing/library';
import { LitElement, html } from 'lit';
import { barcodeScannerBksStyles } from './barcode-scanner-bks-styles.js';
import '../../../components/button-bks/button-bks.js';

export class BarcodeScannerBks extends LitElement {
  static styles = [barcodeScannerBksStyles];

  static properties = {
    result: { type: String },
    hideVideo: { type: Boolean },
    isScanning: { type: Boolean },
  };

  constructor() {
    super();
    this.result = '';
    this.codeReader = new BrowserMultiFormatReader();
    this.hideVideo = true;
    this.isScanning = false;
    this.videoStream = null;
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
              new CustomEvent('sendBarecode', {
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
      <button-bks
        label=${this.isScanning ? 'Stop Scanning' : 'Start Scanning'}
        @click=${this.toggleScanner}
      >
      </button-bks>
    `;
  }
}

customElements.define('barcode-scanner-bks', BarcodeScannerBks);
