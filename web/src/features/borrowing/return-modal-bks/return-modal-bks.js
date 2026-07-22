import { LitElement, html } from 'lit';
import { returnModalBksStyles } from './return-modal-bks-styles.js';
import { returnBorrowing } from '../../../api/borrowing.js';
import '../../../components/modal-bks/modal-bks.js';
import '../../../components/button-bks/button-bks.js';

export class ReturnModalBks extends LitElement {
  static styles = [returnModalBksStyles];

  static properties = {
    open: { type: Boolean, reflect: true },
    borrowingId: { type: Number },
    bookTitle: { type: String },
    studentName: { type: String },
    // Set by the caller when the copy turns out not to be on loan at all, so the modal
    // explains instead of offering a return that would only be refused
    notLoaned: { type: Boolean },
    _step: { type: String, state: true },
    _copyStatus: { type: String, state: true },
    _error: { type: String, state: true },
  };

  constructor() {
    super();
    this.open = false;
    this.borrowingId = null;
    this.bookTitle = '';
    this.studentName = '';
    this.notLoaned = false;
    this._resetState();
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('open') && this.open) {
      this._resetState();
    }
  }

  _resetState() {
    this._step = this.notLoaned ? 'not-loaned' : 'confirm';
    this._copyStatus = '';
    this._error = '';
  }

  render() {
    return html`
      <modal-bks ?open=${this.open} @modal-close=${this._handleClose}>
        ${this._stepTpl}
      </modal-bks>
    `;
  }

  get _stepTpl() {
    switch (this._step) {
      case 'success':
        return this._successTpl;
      case 'not-loaned':
        return this._notLoanedTpl;
      default:
        return this._confirmTpl;
    }
  }

  get _confirmTpl() {
    return html`
      <div class="return-modal-content">
        <h2>
          Return <span class="book-title-highlight">${this.bookTitle}</span>
          borrowed by ${this.studentName}?
        </h2>
        <p class="return-hint">
          The copy goes back on the shelf, or to the next student in the queue.
        </p>
        ${this._error ? html`<p class="error">${this._error}</p>` : ''}
        <div class="button-container">
          <button-bks
            label="Yes"
            @button-click=${this._handleConfirmYes}
          ></button-bks>
          <button-bks
            variant="secondary"
            label="No"
            @button-click=${this._handleClose}
          ></button-bks>
        </div>
      </div>
    `;
  }

  get _successTpl() {
    return html`
      <div class="return-modal-content">
        <h2>
          <span class="book-title-highlight">${this.bookTitle}</span>
          has been returned.
        </h2>
        <p class="return-hint">${this._copyStatusLabel}</p>
        <div class="button-container">
          <button-bks
            label="Close"
            @button-click=${this._handleClose}
          ></button-bks>
        </div>
      </div>
    `;
  }

  get _notLoanedTpl() {
    return html`
      <div class="return-modal-content">
        <h2>
          <span class="book-title-highlight">${this.bookTitle}</span>
          is not out on loan.
        </h2>
        <p class="return-hint">
          Somebody has returned it already, so there is nothing to check in.
        </p>
        <div class="button-container">
          <button-bks
            variant="secondary"
            label="Close"
            @button-click=${this._handleClose}
          ></button-bks>
        </div>
      </div>
    `;
  }

  get _copyStatusLabel() {
    switch (this._copyStatus) {
      case 'available':
        return 'The copy is back on the shelf and can be borrowed again.';
      case 'on_hold':
        return 'The copy is set aside for the next student in the queue.';
      default:
        return '';
    }
  }

  async _handleConfirmYes() {
    try {
      const borrowing = await returnBorrowing(this.borrowingId);
      this._copyStatus = borrowing?.copyStatus ?? '';
      this._step = 'success';
      this.dispatchEvent(
        new CustomEvent('borrowing-returned', {
          detail: { borrowingId: this.borrowingId },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      // 409: somebody else checked this loan back in first. There is nothing to
      // retry, so say so and let the caller refresh its stale list.
      if (err.status === 409) {
        this._step = 'not-loaned';
        this.dispatchEvent(
          new CustomEvent('borrowing-returned', {
            detail: { borrowingId: this.borrowingId },
            bubbles: true,
            composed: true,
          }),
        );
        return;
      }

      // eslint-disable-next-line no-console
      console.error('Failed to return borrowing:', err);
      this._error = err.message;
    }
  }

  _handleClose() {
    this.dispatchEvent(
      new CustomEvent('modal-close', { bubbles: true, composed: true }),
    );
  }
}

customElements.define('return-modal-bks', ReturnModalBks);
