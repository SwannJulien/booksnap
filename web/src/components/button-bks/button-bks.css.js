import { css } from 'lit';
import { resetStyles } from '../../shared-styles.js';

export const buttonBks = [
  resetStyles,
  css`
    :host {
      display: inline-block;
    }
    button {
      min-width: 8rem;
      padding: 1em 1.5em;
      background-color: var(--clr-accent);
      color: var(--clr-dark);
      border: none;
      border-radius: var(--border-radius-default);
      font-size: var(--step--1);
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    button:hover:not(:disabled) {
      background-color: #279c71;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
];
