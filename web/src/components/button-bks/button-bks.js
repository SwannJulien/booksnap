import { LitElement, html } from 'lit';
import { buttonBksStyles } from './button-bks-styles.js';

export class ButtonBks extends LitElement {
  static styles = [buttonBksStyles];

  static formAssociated = true;

  static properties = {
    label: { type: String },
    disabled: { type: Boolean },
    type: { type: String },
    icon: { type: String },
  };

  constructor() {
    super();
    this.label = 'Button';
    /** @type {'button' | 'submit' | 'reset'} */
    this.type = 'button';
    this.disabled = false;
    this.internals = this.attachInternals();
    this.icon = '';
  }

  render() {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <span class=${this.icon ? 'text-align' : ''}>
          ${this._handleIcon()} ${this.label}
        </span>
      </button>
    `;
  }

  _handleIcon() {
    const icons = {
      add: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#111827"
      >
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
      </svg>`,
    };

    return icons[this.icon] || null;
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
