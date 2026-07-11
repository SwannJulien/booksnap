import { LitElement, html } from 'lit';
import { catalogView } from './catalog-view-styles.js';

export class CatalogView extends LitElement {
  static styles = [catalogView];

  static properties = {};

  render() {
    return html` <h1>Catalog View</h1> `;
  }
}

customElements.define('catalog-view', CatalogView);
