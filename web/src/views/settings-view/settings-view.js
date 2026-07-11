import { LitElement, html } from 'lit';
import { settingsView } from './settings-view-styles.js';

export class SettingsView extends LitElement {
  static styles = [settingsView];

  static properties = {};

  render() {
    return html` <h1>Settings View</h1> `;
  }
}

customElements.define('settings-view', SettingsView);
