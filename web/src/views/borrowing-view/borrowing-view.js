import { LitElement, html } from 'lit';
import { Task } from '@lit/task';
import { Router } from '@vaadin/router';
import { borrowingView } from './borrowing-view-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import { getBorrowings } from '../../api/borrowing.js';
import { getHolds } from '../../api/hold.js';
import { CoverController } from '../../controllers/cover-controller.js';
import '../../components/button-bks/button-bks.js';
import '../../components/spinner-bks/spinner-bks.js';
import '../../components/dropdown-bks/dropdown-bks.js';
import '../../features/borrowing/return-modal-bks/return-modal-bks.js';
import '../../features/borrowing/loan-modal-bks/loan-modal-bks.js';

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 300;

const RETURN_ICON_PATH =
  'M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z';
const HAND_OVER_ICON_PATH =
  'M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Zm190 520 226-226-56-58-170 170-86-84-56 56 142 142Z';

const BORROWED = 'borrowed';
const HOLD = 'hold';

// The two lists answer different questions, so each brings its own status filters
const QUICK_FILTERS = {
  [BORROWED]: [
    { label: 'All Loans', status: '' },
    { label: 'Late', status: 'overdue' },
    { label: 'On-time', status: 'borrowed' },
  ],
  [HOLD]: [
    { label: 'All Holds', status: '' },
    { label: 'Ready', status: 'active' },
    { label: 'Waiting', status: 'pending' },
    { label: 'Expired', status: 'expired' },
  ],
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// LocalDate string ("2023-10-12") to a local Date, avoiding UTC parsing shifts. Also
// accepts a LocalDateTime ("2023-10-12T09:30:00"), whose time part is not shown.
function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return parseDate(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function paginationText(pageInfo) {
  const { page, size, totalElements } = pageInfo;
  if (!totalElements) return 'No results';
  const start = (page - 1) * size + 1;
  const end = Math.min(page * size, totalElements);
  return html`Showing <strong>${start} to ${end}</strong> of ${totalElements}
    results`;
}

function daysLate(endDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.round((today - parseDate(endDateStr)) / MS_PER_DAY));
}

function holdStatusTpl(hold) {
  switch (hold.status) {
    case 'active':
      return html`<span class="status-pill status-ready">Ready</span>`;
    case 'expired':
      return html`<span class="status-pill status-late">Expired</span>`;
    default:
      return html`<span class="status-pill status-waiting">Waiting</span>`;
  }
}

function userCellTpl(user) {
  return html`
    <div class="user-detail-container">
      <span class="user-avatar">
        ${(user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')}
      </span>
      <div class="user-info">
        <span class="user-name">${user.firstName} ${user.lastName}</span>
        <span class="user-id">ID: #BK-${user.id}</span>
      </div>
    </div>
  `;
}

const headerTpl = html`
  <div class="header">
    <div class="header-title">
      <h1>Borrowings</h1>
      <p>Track and manage active book loans and member reservations</p>
    </div>
    <button-bks
      label="New Loan"
      icon="add"
      @click=${() => Router.go('/scan')}
    ></button-bks>
  </div>
`;

export class BorrowingView extends LitElement {
  static styles = [sharedStyles, borrowingView];

  static properties = {
    page: { type: Number },
    size: { type: Number },
    _mode: { type: String, state: true },
    _query: { type: String, state: true },
    _committedQuery: { type: String, state: true },
    _status: { type: String, state: true },
    _openActionMenuId: { state: true },
    _borrowingToReturn: { type: Object, state: true },
    _holdToHandOver: { type: Object, state: true },
  };

  _covers = new CoverController(this);

  constructor() {
    super();
    this.page = 1;
    this.size = 10;
    this._mode = BORROWED;
    this._query = '';
    this._committedQuery = '';
    this._status = '';
    this._openActionMenuId = null;
    this._borrowingToReturn = null;
    this._holdToHandOver = null;
    this._debounceTimer = null;
    this._handleOutsideClick = this._handleOutsideClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
  }

  // One task for both lists: the two endpoints answer with the same shape, and going
  // through a single task keeps the tab switch from fetching the list it is leaving.
  listTask = new Task(this, {
    task: async ([mode, page, size, q, status]) => {
      const data =
        mode === HOLD
          ? await getHolds({ page, size, q, status })
          : await getBorrowings({ page, size, q, status });
      this._covers.fetchForBooks(data.data.map(row => row.book));
      return data;
    },
    args: () => [
      this._mode,
      this.page,
      this.size,
      this._committedQuery,
      this._status,
    ],
  });

  get _isHoldMode() {
    return this._mode === HOLD;
  }

  render() {
    return html`
      ${headerTpl} ${this._toolbarTpl}
      ${this.listTask.render({
        pending: () => html`<spinner-bks></spinner-bks>`,
        complete: results => this._tableTpl(results),
        error: err => html`<p>Error loading ${this._mode}s: ${err.message}</p>`,
      })}
      ${this._returnModalTpl} ${this._handOverModalTpl}
    `;
  }

  get _returnModalTpl() {
    return html`
      <return-modal-bks
        ?open=${!!this._borrowingToReturn}
        .borrowingId=${this._borrowingToReturn?.id}
        .bookTitle=${this._borrowingToReturn?.bookTitle ?? ''}
        .studentName=${this._borrowingToReturn?.studentName ?? ''}
        @modal-close=${this._handleReturnModalClose}
        @borrowing-returned=${this._handleListChanged}
      ></return-modal-bks>
    `;
  }

  // Handing the copy over turns the hold into a loan, so it reuses the loan modal's
  // pickup step rather than a modal of its own
  get _handOverModalTpl() {
    return html`
      <loan-modal-bks
        ?open=${!!this._holdToHandOver}
        .copyId=${this._holdToHandOver?.copyId}
        .bookTitle=${this._holdToHandOver?.bookTitle ?? ''}
        .hold=${this._holdToHandOver?.hold ?? null}
        @modal-close=${this._handleHandOverModalClose}
        @loan-created=${this._handleListChanged}
        @copy-unavailable=${this._handleListChanged}
      ></loan-modal-bks>
    `;
  }

  get _toolbarTpl() {
    return html`
      <div class="toolbar">
        <div class="mode-switch" role="tablist">
          <button
            class="mode-chip ${this._isHoldMode ? '' : 'active'}"
            role="tab"
            aria-selected=${!this._isHoldMode}
            @click=${() => this._handleModeChange(BORROWED)}
          >
            Borrowed
          </button>
          <button
            class="mode-chip ${this._isHoldMode ? 'active' : ''}"
            role="tab"
            aria-selected=${this._isHoldMode}
            @click=${() => this._handleModeChange(HOLD)}
          >
            On Hold
          </button>
        </div>
        <input
          name="search"
          type="search"
          placeholder="Search by name, email, or user ID..."
          .value=${this._query}
          @input=${this._handleSearchInput}
        />
      </div>
      <div class="quick-filters">
        <span class="quick-filters-label">Quick filters:</span>
        ${QUICK_FILTERS[this._mode].map(
          filter => html`
            <button
              class="filter-chip ${
                this._status === filter.status ? 'active' : ''
              }"
              @click=${() => this._handleFilterChange(filter.status)}
            >
              ${filter.label}
            </button>
          `,
        )}
      </div>
    `;
  }

  _tableTpl(results) {
    const isHold = this._isHoldMode;

    return html`
      <table>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>User</th>
            <th>${isHold ? 'Placed On' : 'Borrow Date'}</th>
            <th>${isHold ? 'Collect Before' : 'Due Date'}</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
            results.data.length
              ? results.data.map(row =>
                  isHold ? this._holdRowTpl(row) : this._borrowingRowTpl(row),
                )
              : html`<tr>
                  <td colspan="6" class="empty-state">
                    ${isHold ? 'No holds found' : 'No borrowings found'}
                  </td>
                </tr>`
          }
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6">
              <div class="footer-content">
                <span>${paginationText(results.page)}</span>
                <div class="footer-btn-container">
                  <button
                    class="btn-previous"
                    ?disabled=${results.page.page <= 1}
                    @click=${this._handleClickPrevious}
                  >
                    Previous
                  </button>
                  <button
                    class="btn-next"
                    ?disabled=${results.page.page >= results.page.totalPages}
                    @click=${this._handleClickNext}
                  >
                    Next
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  _borrowingRowTpl(borrowing) {
    const isLate = borrowing.status === 'overdue';

    return html`
      <tr>
        <td>${this._bookCellTpl(borrowing.book)}</td>
        <td>${userCellTpl(borrowing.user)}</td>
        <td>${formatDate(borrowing.startDate)}</td>
        <td class=${isLate ? 'due-date-late' : ''}>
          ${formatDate(borrowing.endDate)}
        </td>
        <td>
          ${
            isLate
              ? html`<span class="status-pill status-late">
                  Late (${daysLate(borrowing.endDate)} days)
                </span>`
              : html`<span class="status-pill status-on-time">On-time</span>`
          }
        </td>
        <td>
          ${this._actionsTpl(borrowing, [
            {
              action: 'return-book',
              data: borrowing,
              path: RETURN_ICON_PATH,
              label: 'Return',
              class: '',
            },
          ])}
        </td>
      </tr>
    `;
  }

  _holdRowTpl(hold) {
    // Only an active hold has a copy set aside, so it is the only one that can be
    // handed over — the others have nothing to give the student yet
    const options =
      hold.status === 'active'
        ? [
            {
              action: 'hand-over-hold',
              data: hold,
              path: HAND_OVER_ICON_PATH,
              label: 'Hand over',
              class: '',
            },
          ]
        : [];

    return html`
      <tr>
        <td>${this._bookCellTpl(hold.book)}</td>
        <td>${userCellTpl(hold.user)}</td>
        <td>${formatDate(hold.placedOn)}</td>
        <td class=${hold.status === 'expired' ? 'due-date-late' : ''}>
          ${formatDate(hold.endDate) || '—'}
        </td>
        <td>${holdStatusTpl(hold)}</td>
        <td>${options.length ? this._actionsTpl(hold, options) : ''}</td>
      </tr>
    `;
  }

  _bookCellTpl(book) {
    return html`
      <div class="book-detail-container">
        ${this._coverTpl(book)}
        <div class="book-info">
          <span class="book-title">${book.title}</span>
          <span class="book-authors">${book.authors?.join(', ')}</span>
        </div>
      </div>
    `;
  }

  _actionsTpl(row, options) {
    const isMenuOpen = this._openActionMenuId === row.id;

    return html`
      <div class="action-menu-wrapper">
        <button
          class="action-btn ${isMenuOpen ? 'active' : ''}"
          aria-label="More actions"
          @click=${() => this._handleToggleActionMenu(row.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path
              d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
            />
          </svg>
        </button>
        ${
          isMenuOpen
            ? html`
                <dropdown-bks
                  .options=${options}
                  @dropdown-selected-option=${this._handleDropdownAction}
                ></dropdown-bks>
              `
            : ''
        }
      </div>
    `;
  }

  _coverTpl(book) {
    const isbn = book.isbn13 || book.isbn10;
    const coverUrl = isbn ? this._covers.get(isbn) : null;

    return coverUrl
      ? html`<img class="book-cover" src=${coverUrl} alt="${book.title}" />`
      : html`<div class="cover-placeholder">No cover</div>`;
  }

  _handleToggleActionMenu(rowId) {
    this._openActionMenuId = this._openActionMenuId === rowId ? null : rowId;
  }

  _handleOutsideClick(e) {
    if (!this._openActionMenuId) return;
    const clickedOnMenu = e
      .composedPath()
      .some(
        el =>
          el.classList?.contains('action-dropdown') ||
          el.classList?.contains('action-btn'),
      );
    if (!clickedOnMenu) {
      this._openActionMenuId = null;
    }
  }

  _handleDropdownAction(e) {
    const { action, data } = e.detail;
    this._openActionMenuId = null;

    switch (action) {
      case 'return-book':
        this._handleReturnBook(data);
        break;
      case 'hand-over-hold':
        this._handleHandOverHold(data);
        break;
      default:
        break;
    }
  }

  _handleReturnBook(borrowing) {
    const { book, user } = borrowing;
    this._borrowingToReturn = {
      id: borrowing.id,
      bookTitle: book.title,
      studentName: `${user.firstName} ${user.lastName}`,
    };
  }

  _handleReturnModalClose() {
    this._borrowingToReturn = null;
  }

  _handleHandOverHold(hold) {
    this._holdToHandOver = {
      copyId: String(hold.copyId),
      bookTitle: hold.book.title,
      hold: {
        userId: hold.user.id,
        firstName: hold.user.firstName,
        lastName: hold.user.lastName,
        endDate: hold.endDate,
      },
    };
  }

  _handleHandOverModalClose() {
    this._holdToHandOver = null;
  }

  // A returned loan or a collected hold leaves the list it was in, so refetch the page
  _handleListChanged() {
    this.listTask.run();
  }

  _handleModeChange(mode) {
    if (this._mode === mode) return;
    this._mode = mode;
    // The filters belong to the list being left; the same is true of the page number
    this._status = '';
    this.page = 1;
    this._openActionMenuId = null;
  }

  _handleFilterChange(status) {
    this._status = status;
    this.page = 1;
  }

  _handleSearchInput(e) {
    this._query = e.target.value;

    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => {
      // "#BK-9021" is the displayed user id format; search by the bare id.
      const query = this._query.trim().replace(/^#?BK-/i, '');
      const committed = query.length >= MIN_QUERY_LENGTH ? query : '';
      if (committed !== this._committedQuery) {
        this._committedQuery = committed;
        this.page = 1;
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  _handleClickPrevious() {
    if (this.page > 1) {
      this.page -= 1;
    }
  }

  _handleClickNext() {
    this.page += 1;
  }
}

customElements.define('borrowing-view', BorrowingView);
