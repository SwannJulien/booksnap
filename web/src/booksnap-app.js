import { Router } from '@vaadin/router';
import { LitElement, html } from 'lit';

import { booksnapApp } from './booksnap-app-styles.js';
import './components/barecode-scanner/barecode-scanner.js';
import './views/save-book/save-book.js';
import './views/home-view/home-view.js';
import './views/search-book/search-book.js';

class BooksnapApp extends LitElement {
  static styles = [booksnapApp];

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('main'));
    const linkItems = this.shadowRoot.querySelectorAll('nav a');
    const listItems = this.shadowRoot.querySelectorAll('nav li');

    // TODO: find a way to create a function to avoid code duplication on adding the active class
    router.setRoutes([
      {
        path: '/',
        component: 'home-view',
        action: () => {
          // First reset all active classes to avoid conflicts when navigating back
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          // Then add the active class to the current list
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/search',
        component: 'search-book',
        action: async () => {
          await import('./views/home-view/home-view.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/search') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/book',
        component: 'save-book',
        action: async () => {
          await import('./views/save-book/save-book.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/book') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/catalog',
        component: 'catalog-view',
        action: async () => {
          await import('./views/catalog-view/catalog-view.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/catalog') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/borrowings',
        component: 'borrowing-view',
        action: async () => {
          await import('./views/borrowing-view/borrowing-view.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/borrowings') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/analytics',
        component: 'analytics-view',
        action: async () => {
          await import('./views/analytics-view/analytics-view.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/analytics') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/settings',
        component: 'settings-view',
        action: async () => {
          await import('./views/settings-view/settings-view.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/settings') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '/account',
        component: 'account-view',
        action: async () => {
          await import('./views/account-view/account-view.js');
          listItems.forEach(item => {
            item.classList.remove('active');
          });
          linkItems.forEach(element => {
            if (element.getAttribute('href') === '/account') {
              element.parentElement.classList.add('active');
            }
          });
        },
      },
      {
        path: '(.*)',
        redirect: '/',
      },
    ]);
  }

  toggleSidebar() {
    const sidebar = this.shadowRoot.getElementById('sidebar');
    // Toggle class .close if toggle-btn is pressed
    sidebar.classList.toggle('close');
    // Remove class .close if screen size < 48em
    window.addEventListener('resize', () => {
      if (window.matchMedia(`(max-width: 48em)`).matches) {
        sidebar.classList.remove('close');
      }
    });
  }

  toggleActive(event) {
    const listItems = this.shadowRoot.querySelectorAll('nav li');
    listItems.forEach(item => {
      item.classList.remove('active');
    });
    event.currentTarget.closest('li').classList.add('active');
  }

  // TODO: change icon and title: +1 Add book and maybe put the scanning icon for borrowings
  render() {
    return html`
      <nav id="sidebar">
        <ul>
          <li>
            <span class="logo">Booksnap</span>
            <button id="toggle-btn" @click=${this.toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path
                  d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
                />
              </svg>
            </button>
          </li>
          <li>
            <a href="/" @click=${this.toggleActive}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
                />
              </svg>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="/catalog" @click=${this.toggleActive}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M80-160v-80h800v80H80Zm80-160v-320h80v320h-80Zm160 0v-480h80v480h-80Zm160 0v-480h80v480h-80Zm280 0L600-600l70-40 160 280-70 40Z"
                />
              </svg>
              <span>Catalog</span>
            </a>
          </li>
          <li>
            <a href="/search" @click=${this.toggleActive}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M40-120v-200h80v120h120v80H40Zm680 0v-80h120v-120h80v200H720ZM160-240v-480h80v480h-80Zm120 0v-480h40v480h-40Zm120 0v-480h80v480h-80Zm120 0v-480h120v480H520Zm160 0v-480h40v480h-40Zm80 0v-480h40v480h-40ZM40-640v-200h200v80H120v120H40Zm800 0v-120H720v-80h200v200h-80Z"
                />
              </svg>
              <span>Scan Book</span>
            </a>
          </li>
          <li>
            <a href="/borrowings" @click=${this.toggleActive}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"
                />
              </svg>
              <span>Borrowings</span>
            </a>
          </li>
          <li>
            <a href="/analytics" @click=${this.toggleActive}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
              >
                <path
                  d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z"
                />
              </svg>
              <span>Analytics</span>
            </a>
          </li>
            <li>
              <a href="/settings" @click=${this.toggleActive}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"
                  />
                </svg>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a href="/account" @click=${this.toggleActive}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path
                    d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"
                  />
                </svg>
                <span>Account</span>
              </a>
            </li>
          </div>
        </ul>
      </nav>
      <main></main>
    `;
  }
}

customElements.define('booksnap-app', BooksnapApp);
