import { css } from 'lit';

export const copySectionModalBksStyles = css`
  .update-section-modal-content {
    text-align: center;
  }

  .update-section-modal-content h2,
  .update-section-modal-content p {
    margin-top: 0;
  }

  .update-section-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .update-section-icon svg {
    width: 48px;
    height: 48px;
    fill: var(--clr-accent);
    background-color: rgba(59, 130, 246, 0.15);
    border-radius: 50%;
    padding: 0.5rem;
  }

  .update-section-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .update-section-form-group label {
    color: var(--clr-text-light);
    font-weight: 500;
    margin-bottom: .5rem;
  }

  .update-section-form-group input {
    padding: 0.75rem;
    border: 1px solid var(--clr-border);
    border-radius: var(--border-radius-default);
    font-size: 1rem;
    background-color: var(--clr-main-dark);
    color: var(--clr-text-light);
  }

  .update-section-form-group input:focus {
    outline: none;
    border-color: var(--clr-accent);
  }

  .update-section-error {
    color: var(--clr-warning);
    background-color: rgba(239, 68, 68, 0.15);
    padding: 0.75rem;
    border-radius: var(--border-radius-default);
    margin-bottom: 1rem;
  }

  .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .btn-cancel,
  .btn-confirm {
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
    background-color: var(--clr-text-muted);
    color: var(--clr-nav-dark);
    font-weight: 700;
  }

  .btn-cancel:hover {
    filter: brightness(1.1);
  }

  .btn-confirm {
    background-color: var(--clr-accent);
    color: var(--clr-nav-dark);
    font-weight: 700;
  }

  .btn-confirm:hover {
    filter: brightness(1.1);
  }
`;
