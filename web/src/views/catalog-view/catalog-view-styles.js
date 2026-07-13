import { css } from 'lit';
import { sharedStyles } from '../../shared-styles.js';

export const catalogView = [
  sharedStyles,
  css`
    :host {
      display: block;
      width: 100%;
      max-width: 1280px;
    }

    p {
      color: var(--clr-text-muted);
    }

    .header {
      display: flex;
      justify-content: space-between;
    }

    .searchbar-container {
      display: flex;
      gap: 1rem;
      padding: 1.2rem;
      background-color: var(--clr-card-gray);
      border-radius: var(--border-radius-default);
    }

    input,
    select {
      background-color: var(--clr-main-dark);
      color: var(--clr-text-light);
    }

    .searchbar-container input {
      background-image: url('../../../assets/search.svg');
      background-repeat: no-repeat;
      background-position: left 10px center;
      background-size: 26px;
      padding-left: 40px;
    }

    select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url('../../../assets/arrow_down.svg');
      background-repeat: no-repeat;
      background-position: right 6px center;
      background-size: 26px;
      cursor: pointer;
    }

    input[name='search'] {
      width: 800px;
    }

    select[name='availability'] {
      width: 200px;
    }

    button {
      background-color: var(--clr-main-dark);
      border: 1px solid var(--clr-border);
      border-radius: var(--border-radius-default);
      padding: 0.5rem;
      height: 43px;
    }

    .update-modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .update-modal-content {
      position: relative;
      background-color: var(--clr-card-gray);
      border-radius: var(--border-radius-default);
      padding: 2rem 3rem;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      width: 90%;
    }

    .update-modal-content h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: var(--clr-text-light);
    }

    .update-modal-content .close-modal-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      color: var(--clr-text-light);
      cursor: pointer;
      line-height: 1;
    }

    .update-modal-content .close-modal-btn:hover {
      color: var(--clr-text-muted);
    }

    @media print {
      .header,
      search-bar-bks,
      book-table-bks,
      .update-modal-overlay {
        display: none !important;
      }
    }
  `,
];
