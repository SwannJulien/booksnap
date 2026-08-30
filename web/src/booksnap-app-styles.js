import { css } from 'lit';
import { sharedStyles } from './shared-styles.js';

export const booksnapApp = [
  sharedStyles,
  css`
    :host {
      min-height: 100vh;
      color: var(--clr-text-light);
      display: grid;
      grid-template-columns: auto 1fr;
      padding-right: 2em;
      gap: 2em;
    }

    main {
      padding-top: 20px;
      min-height: 100vh;
    }

    nav {
      box-sizing: border-box;
      height: 100%;
      padding-top: 20px;
      width: clamp(12rem, 25vw, 16rem);
      border-right: 1px solid #000000;
      background-color: var(--clr-nav-dark);

      position: sticky;
      top: 0;
      align-self: start;
      transition: 300ms ease-in-out;
      overflow-x: hidden;
      overflow-y: hidden;
      text-wrap: nowrap;
    }

    nav.close {
      width: 60px;
      padding: 2px;

      a {
        padding: 0.5em;
      }
      li.active a {
        border-inline-start: 2px solid var(--clr-accent);
      }
      .logo {
        display: none;
      }
      ul {
        margin: 1rem 0 0;
      }
      .toggle-btn {
        padding-right: 0.9rem;
      }
    }

    nav ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0 1rem;
    }

    nav ul > li:first-child {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 16px;
    }

    nav ul li.divider {
      margin-top: 2rem;
      margin-bottom: 1rem;
      padding: 0 1rem;
      height: 1px;
      background-color: var(--clr-border, #4a5568);
    }

    nav ul li a {
      border-inline-start: 4px solid transparent;
    }

    nav ul li.active a {
      border-inline-start: 4px solid var(--clr-accent);
      color: var(--clr-text-light);
      background-color: var(--clr-card-gray);
      border-radius: 0 var(--border-radius-default) var(--border-radius-default)
        0;

      svg {
        fill: var(--clr-text-light);
      }
    }

    nav svg {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
      fill: var(--clr-text-muted);
    }

    nav a {
      padding: 0.85em;
      text-decoration: none;
      color: var(--clr-text-muted);
      display: flex;
      align-items: center;
      gap: 1em;
    }

    .logo {
      font-family: var(--font-title), sans-serif;
      font-weight: 600;
      font-size: var(--step-2);
      padding-left: 0.425em;
      padding-bottom: 0.3em;
      color: var(--clr-accent);
    }

    nav a:hover {
      color: var(--clr-text-light);

      svg {
        fill: var(--clr-text-light);
      }
    }

    .toggle-btn {
      margin-left: auto;
      padding-right: 1em;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .toggle-btn svg {
      width: 30px;
      height: 30px;
    }

    .toggle-btn svg:hover {
      fill: var(--clr-text-light);
    }

    @media (max-width: 75rem) {
      :host {
        grid-template-columns: 1fr;
        padding-right: 0;
      }
      main {
        padding: 2em 1em 60px 1em;
      }

      nav {
        height: 60px;
        width: 100%;
        border-right: none;
        border-top: 1px solid #000000;
        padding: 0;
        position: fixed;
        top: unset;
        bottom: 0;
        display: flex;
        justify-content: center;
        z-index: 100;

        > ul {
          margin: 0;
          padding: 0;
          display: grid;
          grid-auto-columns: 60px;
          grid-auto-flow: column;
          align-items: center;
          overflow-y: hidden;
        }

        ul li {
          height: 100%;
        }

        ul li span,
        ul li:first-child,
        ul li.divider {
          display: none;
        }

        ul li:nth-child(9) {
          margin-bottom: 0;
        }

        ul a {
          width: 60px;
          height: 60px;
          padding: 0;
          border-radius: 0;
          justify-content: center;
        }

        a {
          box-sizing: border-box;
          padding: 1em;
          width: auto;
          justify-content: center;
        }
      }
      nav ul li a {
        border-bottom: 4px solid transparent;
        transition: border-bottom 0.5s ease;
      }
      nav ul li.active a {
        border-left: none;
        border-bottom: 4px solid var(--clr-accent);
        border-radius: var(--border-radius-default) var(--border-radius-default)
          0 0;
      }
    }

    @media print {
      nav {
        display: none !important;
      }
    }
  `,
];
