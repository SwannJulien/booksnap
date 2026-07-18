import { css } from 'lit';
import { sharedStyles } from '../../shared-styles.js';

export const scanQrcodeView = [
  sharedStyles,
  css`
    :host {
      display: block;
      width: 100%;
      max-width: 1280px;
    }

    .header p {
      color: var(--clr-text-muted);
    }
  `,
];
