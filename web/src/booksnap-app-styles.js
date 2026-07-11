import { css } from 'lit';
import { resetStyles } from './shared-styles.js';

export const booksnapApp = [
  resetStyles,
  css`
    :host {
      min-height: 100vh;
      color: var(--clr-text-light);
      display: grid;
      grid-template-columns: auto 1fr;
      padding-right: 2em;
      gap: 2em;
      overflow: hidden;
    }

    main {
      overflow: auto;
      height: 100vh;
      padding-top: 20px;
    }
    /* FIXME: le scroll de la barre de nav s'arrête et c'est le scroll de la fenêtre qui prend le relais */
    #sidebar {
      box-sizing: border-box;
      height: 100%;
      padding-top: 20px;
      width: clamp(12rem, 25vw, 16rem);
      border-right: 1px solid #000000;
      background-color: var(--clr-dark);

      position: sticky;
      top: 0;
      align-self: start;
      transition: 300ms ease-in-out;
      overflow-x: hidden;
      overflow-y: auto;
      text-wrap: nowrap;
    }

    #sidebar.close {
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
      #toggle-btn {
        padding-right: 0.9rem;
      }
    }

    #sidebar ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0 1rem;
    }

    #sidebar ul > li:first-child {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 16px;
    }

    #sidebar ul li:nth-child(7) {
      margin-top: auto;
    }

    #sidebar ul li:nth-child(8) {
      margin-bottom: 2rem;
    }

    #sidebar ul li a {
      border-inline-start: 4px solid transparent;
    }

    #sidebar ul li.active a {
      border-inline-start: 4px solid var(--clr-accent);
      color: var(--clr-text-light);
      background-color: var(--clr-gray);
      border-radius: 0 var(--border-radius-default) var(--border-radius-default)
        0;

      svg {
        fill: var(--clr-text-light);
      }
    }

    #sidebar svg {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
      fill: var(--clr-text-muted);
    }

    #sidebar a {
      padding: 0.85em;
      text-decoration: none;
      color: var(--clr-text-muted);
      display: flex;
      align-items: center;
      gap: 1em;
    }

    .logo {
      font-family: 'Boogaloo', sans-serif;
      font-weight: 400;
      font-size: var(--step-3);
      padding-left: 0.425em;
      padding-bottom: 0.3em;
      color: var(--clr-accent);
    }

    #sidebar a:hover {
      color: var(--clr-text-light);

      svg {
        fill: var(--clr-text-light);
      }
    }

    #toggle-btn {
      margin-left: auto;
      padding-right: 1em;
      border: none;
      background: none;
      cursor: pointer;
    }

    #toggle-btn svg:hover {
      fill: var(--clr-text-light);
    }

    @media (max-width: 48rem) {
      :host {
        grid-template-columns: 1fr;
        padding-right: 0;
      }
      main {
        padding: 2em 1em 60px 1em;
      }

      #sidebar {
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

        > ul {
          margin: 0;
          padding: 0;
          display: grid;
          grid-auto-columns: 60px;
          grid-auto-flow: column;
          align-items: center;
          overflow-x: scroll;
          overflow-y: hidden;
        }

        ul li {
          height: 100%;
        }

        ul li span,
        ul li:first-child {
          display: none;
        }

        ul li:nth-child(8) {
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
      #sidebar ul li a {
        border-bottom: 4px solid transparent;
        transition: border-bottom 0.5s ease;
      }
      #sidebar ul li.active a {
        border-left: none;
        border-bottom: 4px solid var(--clr-text-light);
      }
    }
  `,
];
