import { css } from 'lit';
import { sharedStyles } from '../../../shared-styles.js';

export const barcodeScannerBksStyles = [
  sharedStyles,
  css`
    video {
      width: 100%;
      max-width: 100%;
      height: auto;
      border: 2px solid #ccc;
      border-radius: var(--border-radius-default);
    }

    button {
      background-color: var(--clr-accent);
      color: var(--clr-nav-dark);
      border: none;
      border-radius: var(--border-radius-default);
      padding: 0.8em 1.5em;
      cursor: pointer;
      font-size: var(--step-0);
      font-weight: bold;
    }

    button-bks {
      margin-top: 0;
    }
  `,
];
