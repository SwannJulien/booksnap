import { LitElement, html } from 'lit';
import { copyTableBksStyles } from './copy-table-bks-styles.js';
import { createCopy } from '../../../api/copy.js';
import '../../../components/spinner-bks/spinner-bks.js';
import '../../../components/dropdown-bks/dropdown-bks.js';

export class CopyTableBks extends LitElement {
  static styles = [copyTableBksStyles];

  static properties = {
    copies: { type: Array },
    bookId: { type: Number },
    bookTitle: { type: String },
    loading: { type: Boolean },
    error: { type: String },
    openActionMenuId: { state: true },
  };

  constructor() {
    super();
    this.copies = [];
    this.bookId = null;
    this.bookTitle = '';
    this.loading = false;
    this.error = '';
    this.openActionMenuId = null;
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
  }

  render() {
    if (this.loading) {
      return html`<spinner-bks></spinner-bks>`;
    }

    if (this.error) {
      return html`<div class="error-message">Error: ${this.error}</div>`;
    }

    return html`
      <table class="copies-table">
        <thead>
          <tr>
            <th>Section</th>
            <th>Identification code</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.copies?.map(
            copy => html`
              <tr>
                <td>${copy.section.name}</td>
                <td>${copy.section.id}</td>
                <td>
                  <div class="status-container">
                    <span
                      class="status-badge ${this._getStatusClass(copy.status)}"
                    >
                      ${this._formatStatus(copy.status)}
                    </span>
                    ${copy.status?.toLowerCase() !== 'available' && copy.dueDate
                      ? html`<span class="status-due-date"
                          >Due ${copy.dueDate}</span
                        >`
                      : ''}
                  </div>
                </td>
                <td>
                  <div class="action-menu-wrapper">
                    <button
                      class="action-btn ${this.openActionMenuId === copy.id
                        ? 'active'
                        : ''}"
                      aria-label="More actions"
                      @click=${() => this._handleCopyAction(copy.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                      >
                        <path
                          d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
                        />
                      </svg>
                    </button>
                    ${this.openActionMenuId === copy.id
                      ? html`
                          <dropdown-bks
                            .options=${this._getDropdownOptions(copy)}
                            @dropdown-selected-option=${this
                              ._handleDropdownAction}
                          ></dropdown-bks>
                        `
                      : ''}
                  </div>
                </td>
              </tr>
            `,
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">
              <button class="add-copy-button" @click=${this._handleAddCopy}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="15px"
                  viewBox="0 -960 960 960"
                  width="15px"
                  fill="currentColor"
                >
                  <path
                    d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
                  ></path>
                </svg>
                <p>Add new copy</p>
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  _getDropdownOptions(copy) {
    // Update status of the copy: 'available', 'borrowed', 'on_hold', 'lost', 'damaged', 'removed'
    // Update section name => show modal: "This action will generate a new QR code for this book, do you want to proceed?"
    // Delete copy: IF last copy THEN open modal saying this is the last copy, by deleting it you would remove the book from the library
    // Print QR Code
    const data = { ...copy, bookId: this.bookId, bookTitle: this.bookTitle };
    return [
      {
        action: 'print-qr-code',
        data,
        path: 'M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z',
        label: 'Print QR Code',
        class: '',
      },
      {
        action: 'update-status',
        data,
        path: 'M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z',
        label: 'Update status',
        class: '',
      },
      {
        action: 'update-section',
        data,
        path: 'M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z',
        label: 'Update section',
        class: '',
      },
      {
        action: 'delete-copy',
        data,
        path: 'M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z',
        label: 'Delete copy',
        class: 'dropdown-item-danger',
      },
    ];
  }

  _handleDropdownAction() {
    // Just close the menu, let the event bubble to parent
    this.openActionMenuId = null;
  }

  _formatStatus(status) {
    if (!status) return '';
    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
  }

  _getStatusClass(status) {
    const s = status?.toLowerCase();
    if (s === 'available') return 'status-available';
    return 'status-borrowed';
  }

  _handleCopyAction(copyId) {
    this.openActionMenuId = this.openActionMenuId === copyId ? null : copyId;
  }

  async _handleAddCopy() {
    const lastCopy = this.copies?.[this.copies.length - 1];
    const payload = {
      bookId: this.bookId,
      libraryId: 1,
      ...(lastCopy?.section?.name && { sectionName: lastCopy.section.name }),
      status: 'available',
    };

    try {
      await createCopy(payload);
      this.dispatchEvent(
        new CustomEvent('copy-created', {
          detail: { bookId: this.bookId },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (error) {
      this.error = error.message;
    }
  }

  _handleOutsideClick(e) {
    if (!this.openActionMenuId) return;
    const path = e.composedPath();
    const clickedOnDropdown = path.some(
      el =>
        el.classList?.contains('action-dropdown') ||
        el.classList?.contains('action-btn'),
    );
    if (!clickedOnDropdown) {
      this.openActionMenuId = null;
    }
  }
}

customElements.define('copy-table-bks', CopyTableBks);
