import { LitElement, html } from 'lit';
import { analyticsView } from './analytics-view-styles.js';

export class AnalyticsView extends LitElement {
  static styles = [analyticsView];

  static properties = {};

  render() {
    return html` <h1>Analytics View</h1> `;
  }
}

customElements.define('analytics-view', AnalyticsView);
