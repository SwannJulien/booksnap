import { css } from 'lit';

export const loanModalBksStyles = css`
  .loan-modal-content {
    display: flex;
    flex-direction: column;
    min-width: 24rem;
    text-align: center;
  }

  .loan-modal-content h2 {
    margin-top: 0;
    font-size: 1.25rem;
  }

  .book-title-highlight {
    color: var(--clr-accent);
    font-weight: 600;
  }

  input[type='search'] {
    padding: 0.75rem 1rem;
    border: 1px solid var(--clr-border);
    border-radius: var(--border-radius-default);
    font-size: 1rem;
    outline: none;
  }

  table {
    width: 100%;
    margin-top: 1rem;
    border-collapse: collapse;
    text-align: left;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--clr-border);
  }

  th {
    color: var(--clr-text-muted);
    font-weight: 600;
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover,
  tbody tr:focus {
    background-color: var(--clr-accent);
    color: var(--clr-main-dark);
  }

  .no-results {
    margin-top: 1rem;
    color: var(--clr-text-muted);
  }

  .error {
    color: var(--clr-warning);
  }

  .unavailable-detail {
    margin: 0;
    color: var(--clr-text-muted);
  }

  .button-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
  }

  .btn-yes,
  .btn-no {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-default);
    font-size: 1rem;
    cursor: pointer;
    min-width: 100px;
  }

  .btn-yes {
    background-color: var(--clr-accent);
    color: var(--clr-nav-dark);
    font-weight: 700;
  }

  .btn-yes:hover {
    filter: brightness(1.1);
  }

  .btn-no {
    background-color: var(--clr-text-muted);
    color: var(--clr-nav-dark);
    font-weight: 700;
  }

  .btn-no:hover {
    filter: brightness(1.1);
  }
`;
