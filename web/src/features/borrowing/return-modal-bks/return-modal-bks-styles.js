import { css } from 'lit';

export const returnModalBksStyles = css`
  .return-modal-content {
    display: flex;
    flex-direction: column;
    min-width: 24rem;
    text-align: center;
  }

  .return-modal-content h2 {
    margin-top: 0;
    font-size: 1.25rem;
  }

  .book-title-highlight {
    color: var(--clr-accent);
    font-weight: 600;
  }

  .return-hint {
    margin: 0;
    color: var(--clr-text-muted);
  }

  .error {
    color: var(--clr-warning);
  }

  .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  button-bks {
    margin-top: 0;
  }
`;
