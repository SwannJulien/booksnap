import { css } from 'lit';

export const createBookBksStyles = css`
  .modal-success,
  .modal-conflict,
  .modal-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-success h2,
  .modal-conflict h2,
  .modal-error h2 {
    margin-top: 0;
  }

  .qr-code {
    width: fit-content;
    margin-inline: auto;
    margin-bottom: 1rem;
  }

  .print-btn {
    margin-inline: auto;
  }

  .error-message {
    color: var(--clr-error, red);
  }

  .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }

  @media print {
    .modal-success > *:not(.qr-code):not(p) {
      display: none !important;
    }

    .qr-code {
      display: block;
      max-width: 100%;
      page-break-inside: avoid;
    }
  }
`;
