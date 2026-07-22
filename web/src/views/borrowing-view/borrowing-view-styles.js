import { css } from 'lit';
import { sharedStyles } from '../../shared-styles.js';

export const borrowingView = [
  sharedStyles,
  css`
    :host {
      display: block;
      width: 100%;
      max-width: 1280px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header p {
      color: var(--clr-text-muted);
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .quick-filters {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .quick-filters-label {
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: var(--step--1);
      color: var(--clr-text-muted);
      margin-right: 0.5rem;
    }

    .filter-chip {
      padding: 0.5rem 1rem;
      border: 1px solid var(--clr-border);
      border-radius: 999px;
      background-color: var(--clr-card-gray);
      color: var(--clr-text-light);
      font-size: var(--step--1);
      cursor: pointer;
    }

    .filter-chip:hover {
      border-color: var(--clr-accent);
    }

    .filter-chip.active {
      background-color: var(--clr-accent);
      border-color: var(--clr-accent);
      color: var(--clr-nav-dark);
      font-weight: 600;
    }

    input[name='search'] {
      background-color: var(--clr-main-dark);
      color: var(--clr-text-light);
      width: min(24rem, 100%);
      box-sizing: border-box;
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
      text-transform: uppercase;
      text-align: left;
      color: var(--clr-text-muted);
      font-family: var(--font-title);
      font-size: var(--step--1);
      letter-spacing: 1px;
    }

    tbody {
      background-color: var(--clr-card-gray);
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
      width: 28%;
    }

    th:nth-child(2),
    td:nth-child(2) {
      width: 22%;
    }

    th:nth-child(3),
    td:nth-child(3),
    th:nth-child(4),
    td:nth-child(4) {
      width: 14%;
    }

    th:nth-child(5),
    td:nth-child(5) {
      width: 15%;
    }

    th:nth-child(6),
    td:nth-child(6) {
      width: 7%;
    }

    td:nth-child(3),
    td:nth-child(4) {
      font-size: var(--step--1);
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
    }

    .book-title {
      font-weight: 600;
    }

    .book-authors {
      font-size: var(--step--1);
      color: var(--clr-text-muted);
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
      flex-shrink: 0;
    }

    .user-detail-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--clr-main-dark);
      color: var(--clr-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--step--1);
      font-weight: 600;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .user-name {
      font-weight: 600;
    }

    .user-id {
      font-size: var(--step--1);
      color: var(--clr-text-muted);
    }

    .due-date-late {
      color: var(--clr-warning);
      font-weight: 600;
    }

    .status-pill {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      font-size: var(--step--1);
      font-weight: 600;
      white-space: nowrap;
    }

    .status-on-time {
      background-color: var(--clr-accent-badge);
      color: var(--clr-accent);
      border: 1px solid var(--clr-accent);
    }

    .status-late {
      background-color: rgba(255, 76, 76, 0.15);
      color: var(--clr-warning);
      border: 1px solid var(--clr-warning);
    }

    .action-menu-wrapper {
      position: relative;
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
      fill: var(--clr-text-muted);
    }

    .action-btn:hover svg {
      fill: var(--clr-text-light);
    }

    .action-btn.active svg {
      fill: var(--clr-accent);
    }

    .empty-state {
      text-align: center;
      color: var(--clr-text-muted);
    }

    tfoot {
      background-color: var(--clr-card-gray);
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
  `,
];
