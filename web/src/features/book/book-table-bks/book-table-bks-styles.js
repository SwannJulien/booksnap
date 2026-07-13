import { css } from 'lit';

export const bookTableBksStyles = css`
  :host {
    display: block;
  }

  table {
    table-layout: fixed;
    margin: 2rem 0;
    width: 100%;
    border-radius: var(--border-radius-default);
    border-collapse: separate;
    overflow: hidden;
    border-spacing: 0;
  }

  thead {
    background-color: #2d3748;
    border-radius: var(--border-radius-default);
    text-transform: uppercase;
    text-align: left;
    color: var(--clr-text-muted);
    font-family: var(--font-title);
    font-size: var(--step--1);
    letter-spacing: 1px;
  }

  tbody {
    background-color: var(--clr-card-gray);
    border-radius: var(--border-radius-default);
  }

  tbody tr td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  th,
  td {
    padding: 1.2rem;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 30%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 20%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 10%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 5%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 10%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 15%;
  }

  th:nth-child(7),
  td:nth-child(7) {
    width: 10%;
  }

  tfoot {
    background-color: var(--clr-card-gray);
    border-radius: var(--border-radius-default);
  }

  tfoot td {
    padding: 1.2rem;
    border-top: 3px solid var(--clr-main-dark);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .footer-btn-container {
    display: flex;
    gap: 0.5rem;
  }

  .footer-btn-container button {
    font-family: 'Open Sans';
    font-size: var(--step-0);
    color: var(--clr-text-light);
    cursor: pointer;
    background-color: var(--clr-main-dark);
    border: 1px solid var(--clr-border);
    border-radius: var(--border-radius-default);
    padding: 0.5rem;
  }

  .footer-btn-container button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-previous {
    width: 6em;
    height: 45px;
  }

  .btn-next {
    width: 4em;
    height: 45px;
  }

  .book-detail-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .book-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .book-title {
    font-size: var(--step-0);
    color: var(--clr-text-light);
    font-weight: 600;
  }

  .book-year {
    font-size: var(--step--1);
    color: var(--clr-text-muted);
  }

  td:nth-child(2),
  td:nth-child(3),
  td:nth-child(4),
  td:nth-child(5) {
    font-size: var(--step--1);
  }

  td:nth-child(5) {
    color: var(--clr-text-muted);
  }

  .availability-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .availability-container.available .availability-text {
    color: var(--clr-accent);
  }

  .availability-container.available .availability-bar-fill {
    background-color: var(--clr-accent);
  }

  .availability-container.unavailable .availability-text {
    color: oklch(80.8% 0.114 19.571);
  }

  .availability-container.unavailable .availability-bar-fill {
    background-color: oklch(80.8% 0.114 19.571);
  }

  .availability-text {
    font-size: var(--step--1);
    font-weight: 500;
  }

  .availability-bar {
    width: 100%;
    height: 6px;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    overflow: hidden;
  }

  .availability-bar-fill {
    width: var(--availability-percent, 0%);
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .actions-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    transition: all 0.3s ease;
  }

  .action-btn svg {
    width: 24px;
    height: 24px;
    fill: var(--clr-text-light);
  }

  .expand-btn svg {
    transition: transform 0.3s ease;
  }

  .expand-btn.expanded {
    background-color: var(--clr-main-dark);
    border-radius: 50%;
    padding: 0.5rem;
  }

  .expand-btn.expanded svg {
    transform: rotate(180deg);
  }

  .action-btn:hover {
    opacity: 0.8;
  }

  .menu-btn svg {
    fill: var(--clr-text-muted);
  }

  .menu-btn:hover svg {
    fill: var(--clr-text-light);
  }

  .menu-btn.active svg {
    fill: var(--clr-accent);
  }

  .action-menu-wrapper {
    position: relative;
  }

  .book-cover {
    width: 40px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .cover-placeholder {
    width: 40px;
    height: 60px;
    background-color: #4a5568;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--clr-text-muted);
    font-size: 0.7rem;
  }

  .cover-loading {
    position: relative;
  }

  .cover-loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--clr-text-light);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .expanded-row td {
    padding: 1rem 1.2rem;
  }

  .expanded-content {
    padding: 0.5rem;
  }
`;
