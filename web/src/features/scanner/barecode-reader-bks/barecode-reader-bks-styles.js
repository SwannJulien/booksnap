import { css } from 'lit';
import { sharedStyles } from '../../../shared-styles.js';

export const barecodeReaderBksStyles = [
  sharedStyles,
  css`
    :host {
      display: block;
    }

    .modal-body-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .modal-body-content h2 {
      margin-top: 0;
    }

    .book-authors {
      color: var(--clr-text-muted);
      margin-top: 0;
    }

    .button-container {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .error-message {
      color: var(--clr-error, red);
    }
  `,
];
