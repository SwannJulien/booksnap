import { css } from 'lit';

export const holdModalBksStyles = css`
  .hold-modal-content {
    display: flex;
    flex-direction: column;
    min-width: 24rem;
    text-align: center;
  }

  .hold-modal-content h2 {
    margin-top: 0;
    font-size: 1.25rem;
  }

  .book-title-highlight {
    color: var(--clr-accent);
    font-weight: 600;
  }

  .hold-hint {
    margin: 0 0 1rem;
    color: var(--clr-text-muted);
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

  .hold-detail {
    margin: 0;
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
