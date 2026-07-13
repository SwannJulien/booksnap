import { LitElement, html } from 'lit';
import { dropdownBksStyles } from './dropdown-bks-styles.js';

/**
 * @typedef {Object} DropdownOption
 * @property {string} action - Action identifier
 * @property {any} data - Data associated with the option
 * @property {string} path - SVG path for the icon
 * @property {string} label - Display label
 * @property {string} [class] - Optional CSS class
 */

export class DropdownBks extends LitElement {
  static properties = {
    options: { type: Array },
  };

  constructor() {
    super();
    /** @type {DropdownOption[]} */
    this.options = [];
  }

  static styles = [dropdownBksStyles];

  render() {
    return html`
      <div class="action-dropdown" role="menu">
        ${this.options.map(
          option => html`
            <button
              class="dropdown-item ${option.class ?? option.class}"
              @click=${() => this._handleClick(option)}
              role="menuitem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d=${option.path} />
              </svg>
              ${option.label}
            </button>
          `,
        )}
      </div>
    `;
  }

  _handleClick(option) {
    this.dispatchEvent(
      new CustomEvent('dropdown-selected-option', {
        detail: { action: option.action, data: option.data },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('dropdown-bks', DropdownBks);
