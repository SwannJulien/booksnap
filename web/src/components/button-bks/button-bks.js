import { LitElement, html } from 'lit';
import { buttonBks } from './button-bks.css.js';

export class ButtonBks extends LitElement {
  static formAssociated = true;

  static properties = {
    label: { type: String },
    disabled: { type: Boolean },
    type: { type: String },
  };

  static styles = [buttonBks];

  constructor() {
    super();
    this.label = 'Button';
    this.disabled = false;
    this.type = 'button';
    this.internals = this.attachInternals();
  }

  render() {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        ${this.label}
      </button>
    `;
  }

  _handleClick(e) {
    // If this is a submit button, use ElementInternals to submit the form
    if (this.type === 'submit' && this.internals.form) {
      this.internals.form.requestSubmit();
    }

    this.dispatchEvent(
      new CustomEvent('button-click', {
        bubbles: true,
        composed: true,
        detail: { event: e },
      }),
    );
  }
}

customElements.define('button-bks', ButtonBks);
