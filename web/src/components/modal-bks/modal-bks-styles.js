import { css } from 'lit';

export const modalBksStyles = css`
  .modal-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-overlay[hidden] {
    display: none;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    cursor: pointer;
  }

  .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    min-width: 20rem;
    max-width: 90vw;
    max-height: 90vh;
    border-radius: var(--border-radius-default);
    background-color: var(--clr-text-light);
    color: var(--clr-main-dark);
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    font-size: 2rem;
    line-height: 1;
    background: none;
    border: none;
    color: inherit;
    padding: 0.25rem;
  }

  .close-btn:hover {
    opacity: 0.7;
  }

  .modal-body {
    overflow-y: auto;
    margin-top: 2rem;
  }

  @media print {
    .modal-overlay {
      position: static;
      background: none;
    }

    .modal-content {
      box-shadow: none;
      border: none;
      background: white;
      max-width: 100%;
      max-height: none;
    }

    .close-btn {
      display: none;
    }
  }
`;
