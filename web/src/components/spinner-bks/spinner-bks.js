import { LitElement, html } from 'lit';
import { spinnerBksStyles } from './spinner-bks-styles.js';

export class SpinnerBks extends LitElement {
  static styles = [spinnerBksStyles];

  render() {
    return html`
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
    `;
  }
}

customElements.define('spinner-bks', SpinnerBks);
