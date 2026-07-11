import { css } from 'lit';
import { resetStyles } from '../../shared-styles.js';

export const saveBook = [
  resetStyles,
  css`
    :host {
      display: block;
    }

    .container {
      padding: 1em;
      border: 1px solid #ccc;
      background: white;
    }

    .intro-container {
      margin-bottom: 3rem;
    }

    .cover-container {
      grid-column: 2;
      margin-bottom: 2em;
      display: flex;
      flex-direction: column;
      align-items: start;
    }

    .book-cover {
      max-width: 300px;
      height: auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .no-cover-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 10em;
      width: 8.5em;
      background-color: #dedede;
    }

    .no-cover {
      text-align: center;
      color: var(--clr-light-gray);
      font-size: var(--step-1);
    }

    .cover-upload {
      cursor: pointer;
      padding: 0.5em 1em;
      margin-top: 1em;
      background: var(--clr-accent);
      color: var(--clr-font);
      font-size: var(--step-0);
      border: none;
    }

    .cover-input {
      display: none;
    }

    .book-card {
      text-align: center;
      padding: 1rem;
    }

    label {
      text-align: left;
      padding-right: 1em;
      font-size: var(--step-1);
    }

    input,
    select {
      padding: 0.5em;
      border: 1px solid #ccc;
      font-size: var(--step-0);
      margin-right: 1em;
    }

    option {
      background-color: white;
    }

    .button-submit {
      grid-column: 2;
      background-color: var(--clr-accent);
      color: var(--clr-text-light);
      border: none;
      width: 9em;
      padding: 0.5em 1em;
      cursor: pointer;
      font-size: var(--step-0);
    }
  `,
];
