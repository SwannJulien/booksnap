import { LitElement, html } from 'lit';
import { homeView } from './home-view-styles.js';

class HomeView extends LitElement {
  static properties = {};

  static styles = [homeView];

  render() {
    return html`
      <section>
        <h1>Welcome to BookSnap</h1>
      </section>
    `;
  }
}

customElements.define('home-view', HomeView);
