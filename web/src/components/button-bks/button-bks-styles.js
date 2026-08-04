import { css } from 'lit';
import { sharedStyles } from '../../shared-styles.js';

export const buttonBksStyles = [
  sharedStyles,
  css`
    :host {
      display: inline-block;
      margin-top: 1.5rem;
    }
    button {
      min-width: 8rem;
      padding: 1em 1.5em;
      background-color: var(--clr-accent);
      color: var(--clr-nav-dark);
      border: none;
      border-radius: var(--border-radius-default);
      font-size: var(--step--1);
      font-weight: 700;
      cursor: pointer;
      transition: filter 0.2s ease;
      text-align: center;
    }

    :host([variant='secondary']) button {
      background-color: var(--clr-text-muted);
      color: var(--clr-nav-dark);
    }

    :host([variant='danger']) button {
      background-color: var(--clr-warning);
      color: #fff;
    }

    button:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      text-align: center;
    }

    .text-align {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `,
];
