import { css } from 'lit';

export const bookFormBksStyles = css`
  :host {
    display: block;
  }

  button-bks {
    margin-top: 0;
  }

  label {
    font-weight: 500;
  }

  label.required::after {
    content: ' *';
    color: var(--clr-warning);
  }

  input, select {
    padding: 1rem;
  }

  .book-form {
    display: grid;
    grid-template-columns: 15% 50%;
    gap: 1em;
    align-items: center;

    @media (max-width: 75rem) {
      grid-template-columns: 1fr;
    }
  }

  .book-form.update {
    grid-template-columns: 30% 70%;
  }
  
  .cover-section {
    grid-column: 2;
    margin-bottom: 2rem;
  }

  .required-note {
    grid-column: 1 / -1;
    font-size: var(--step--1);
    color: var(--clr-text-muted);
    margin-bottom: 0.5rem;
    text-align: right;
  }

  .required-note span {
    color: var(--clr-warning);
  }
`;
