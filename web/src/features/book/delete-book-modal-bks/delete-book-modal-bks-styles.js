import { css } from 'lit';

export const deleteBookModalBksStyles = css`
  .delete-modal-content {
    text-align: center;
  }

  .delete-modal-content h2,
  .delete-modal-content p {
    margin-top: 0;
  }

  .delete-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .delete-icon svg {
    width: 48px;
    height: 48px;
    fill: var(--clr-warning);
    background-color: rgba(239, 68, 68, 0.15);
    border-radius: 50%;
    padding: 0.5rem;
  }

  .book-title-highlight {
    color: var(--clr-warning);
    font-weight: 600;
  }

  .delete-warning {
    font-size: 0.875rem;
    color: var(--clr-text-muted);
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
