import { LitElement, html } from 'lit';
import { accountView } from './account-view-styles.js';

export class AccountView extends LitElement {
  static styles = [accountView];

  static properties = {};

  render() {
    return html` <h1>Account View</h1> `;
  }
}

customElements.define('account-view', AccountView);
