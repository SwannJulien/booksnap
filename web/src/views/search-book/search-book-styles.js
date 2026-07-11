import { css } from 'lit';
import { resetStyles } from '../../shared-styles.js';

export const searchBook = [
  resetStyles,
  css`
    :host {
      display: block;
      max-width: 1200px;
    }

    .tabs {
      display: flex;
      max-width: 380px;
      gap: 20px;
    }

    .tabs button {
      padding: 1em 0;
      width: 12rem;
      background-color: var(--clr-dark-secondary);
      border: none;
      border-bottom: 2px solid transparent;
      font-size: var(--step-0);
      text-align: left;
      color: var(--clr-text-muted);
      cursor: pointer;
    }

    .tabs button.active {
      border-bottom: 2px solid var(--clr-accent);
      color: var(--clr-accent);
    }

    .tab-content {
      padding: 1.5em 1.5em;
      margin: 2rem 0;
      border-radius: var(--border-radius-default);
      background: var(--clr-gray);
    }

    h2 {
      margin-bottom: 1.5rem;
    }

    form {
      display: grid;
      grid-template-columns: 15% 50%;
      gap: 1em;
      align-items: center;
    }

    .input-field {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }

    label {
      text-align: left;
      padding-right: 1em;
      font-size: var(--step-0);
    }

    input,
    select {
      padding: 0.4em;
      border: 1px solid #ccc;
      font-size: var(--step-0);
      margin-right: 1em;
    }

    option {
      background-color: white;
    }

    input:user-invalid,
    select:user-invalid {
      border: solid 2px red;
    }

    input:focus {
      outline: none;
    }

    button-bks {
      margin-top: 1.5em;
    }

    @media (max-width: 768px) {
    }
  `,
];
