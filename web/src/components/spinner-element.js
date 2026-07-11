import { LitElement, html, css } from 'lit';

export class Spinner extends LitElement {
  static styles = css`
    .spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(0, 0, 0, 0.2);
      border-top: 4px solid black;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`
      <div class="spinner-container">
        <div class="spinner"></div>
      </div>
    `;
  }
}

customElements.define('spinner-element', Spinner);
