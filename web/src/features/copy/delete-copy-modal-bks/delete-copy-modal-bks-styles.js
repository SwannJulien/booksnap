import { css } from 'lit';

export const deleteCopyModalBksStyles = css`
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

  .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .btn-cancel,
  .btn-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-default);
    font-size: 1rem;
    cursor: pointer;
    min-width: 140px;
  }

  .btn-cancel {
    background-color: #382626;
    color: var(--clr-text-light);
  }

  .btn-cancel:hover {
    background-color: #2b1d1d;
  }

  .btn-delete {
    background-color: #e31b1b;
    color: white;
  }

  .btn-delete:hover {
    background-color: #ff0f0f;
  }

  .btn-delete svg {
    width: 18px;
    height: 18px;
    fill: white;
  }
`;
