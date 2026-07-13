import { css } from 'lit';
import { sharedStyles } from '../../shared-styles.js';

export const dropdownBksStyles = [
  sharedStyles,
  css`
    .action-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 100;
      min-width: 160px;
      background-color: var(--clr-nav-dark);
      border: 1px solid var(--clr-border);
      border-radius: var(--border-radius-default);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      color: var(--clr-text-light);
      font-size: var(--step--1);
      cursor: pointer;
      text-align: left;
      transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
      background-color: var(--clr-main-dark);
    }

    .dropdown-item svg {
      width: 18px;
      height: 18px;
      fill: var(--clr-text-muted);
    }

    .dropdown-item:hover svg {
      fill: var(--clr-text-light);
    }

    .dropdown-item-danger {
      color: oklch(80.8% 0.114 19.571);
    }

    .dropdown-item-danger svg {
      fill: oklch(80.8% 0.114 19.571);
    }

    .dropdown-item-danger:hover {
      background-color: rgba(239, 68, 68, 0.1);
    }

    .dropdown-item-danger:hover svg {
      fill: oklch(80.8% 0.114 19.571);
    }
  `,
];
