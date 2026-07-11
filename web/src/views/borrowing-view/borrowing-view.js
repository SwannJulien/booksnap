import { LitElement, html } from 'lit';
import { borrowingView } from './borrowing-view-styles.js';

export class BorrowingView extends LitElement {
  static styles = [borrowingView];

  static properties = {};

  render() {
    return html` <h1>Borrowing View</h1> `;
  }
}

customElements.define('borrowing-view', BorrowingView);
