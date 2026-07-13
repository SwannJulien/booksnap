import { LitElement, html } from 'lit';
import { coverUploadStyles } from './cover-upload-bks-styles.js';
import '../../../components/button-bks/button-bks.js';
import '../../../components/spinner-bks/spinner-bks.js';

export class CoverUploadBks extends LitElement {
  static styles = [coverUploadStyles];

  static properties = {
    coverUrl: { type: String }, // OpenLibrary or external cover URL
    isLoading: { type: Boolean },
    _previewUrl: { type: String, state: true }, // Local preview URL
    _file: { type: Object, state: true }, // Uploaded file
  };

  constructor() {
    super();
    this.coverUrl = null;
    this.isLoading = false;
    this._previewUrl = null;
    this._file = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._cleanupPreview();
  }

  updated(changedProperties) {
    if (changedProperties.has('coverUrl') && this.coverUrl) {
      this.isLoading = true;
    }
  }

  render() {
    return html`
      ${this._coverDisplayTpl()}
      <button-bks
        type="button"
        label="Change Cover"
        @click=${this._handleUploadClick}
      ></button-bks>
      <input
        id="cover-upload"
        class="cover-input"
        type="file"
        accept="image/jpeg,image/jpg,.jpg,.jpeg"
        @change=${this._handleCoverChange}
      />
    `;
  }

  _coverDisplayTpl() {
    // Prioritize user-uploaded preview over external URL
    if (this._previewUrl) {
      return html`
        <div class="cover-wrapper">
          ${this.isLoading ? html`<spinner-bks></spinner-bks>` : ''}
          <img
            src="${this._previewUrl}"
            alt="Book cover preview"
            class="cover-preview"
            style="${this.isLoading ? 'visibility:hidden' : ''}"
            @load=${this._handleCoverLoaded}
            @error=${this._handleCoverError}
          />
        </div>
      `;
    }

    if (this.coverUrl) {
      return html`
        <div class="cover-wrapper">
          ${this.isLoading ? html`<spinner-bks></spinner-bks>` : ''}
          <img
            src="${this.coverUrl}"
            alt="Book cover preview"
            class="cover-preview"
            style="${this.isLoading ? 'visibility:hidden' : ''}"
            @load=${this._handleCoverLoaded}
            @error=${this._handleCoverError}
          />
        </div>
      `;
    }

    return html`
      <div class="no-cover-container cover-preview">
        <p class="no-cover">No cover available</p>
      </div>
    `;
  }

  _handleUploadClick() {
    this.shadowRoot.getElementById('cover-upload').click();
  }

  _handleCoverChange(e) {
    const input = e.target;
    const file = input.files && input.files[0];

    if (!file) {
      this._cleanupPreview();
      this._file = null;
      this.isLoading = false;
      this._notifyCoverChange(null);
      return;
    }

    // Validate file type - only accept JPEG
    const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';
    const hasJpegExtension =
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg');

    if (!isJpeg && !hasJpegExtension) {
      this._cleanupPreview();
      this._file = null;
      this.isLoading = false;
      input.value = '';
      this._notifyCoverChange(null);

      // Dispatch error event to be handled by parent component
      this.dispatchEvent(
        new CustomEvent('cover-error', {
          detail: { message: 'Only JPEG images (.jpg, .jpeg) are allowed' },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    this._cleanupPreview();
    this._file = file;
    this._previewUrl = URL.createObjectURL(file);
    this.isLoading = true;
    this._notifyCoverChange(file);
  }

  _handleCoverLoaded() {
    this.isLoading = false;
  }

  _handleCoverError() {
    this.isLoading = false;
    if (!this._file && this.coverUrl) {
      // External cover failed to load
      this.coverUrl = null;
    }
    this.requestUpdate();
  }

  _cleanupPreview() {
    if (this._previewUrl) {
      URL.revokeObjectURL(this._previewUrl);
      this._previewUrl = null;
    }
  }

  _notifyCoverChange(file) {
    this.dispatchEvent(
      new CustomEvent('cover-change', {
        detail: { file },
      }),
    );
  }

  /**
   * Public method to get the current cover (File or URL)
   */
  getCover() {
    return this._file || this.coverUrl || null;
  }

  /**
   * Public method to reset the cover upload
   */
  reset() {
    this._cleanupPreview();
    this._file = null;
    this.coverUrl = null;
    this.isLoading = false;
    const input = this.shadowRoot.getElementById('cover-upload');
    if (input) {
      input.value = '';
    }
  }
}

customElements.define('cover-upload-bks', CoverUploadBks);
