import { LitElement, html } from 'lit';
import { Task } from '@lit/task';
import { Router } from '@vaadin/router';
import { borrowingView } from './borrowing-view-styles.js';
import { sharedStyles } from '../../shared-styles.js';
import { getBorrowings } from '../../api/borrowing.js';
import { CoverController } from '../../controllers/cover-controller.js';
import '../../components/button-bks/button-bks.js';
import '../../components/spinner-bks/spinner-bks.js';

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 300;

const QUICK_FILTERS = [
  { label: 'All Loans', status: '' },
  { label: 'Late', status: 'overdue' },
  { label: 'On-time', status: 'borrowed' },
];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// LocalDate string ("2023-10-12") to a local Date, avoiding UTC parsing shifts.
function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
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

const headerTpl = html`
  <div class="header">
    <div class="header-title">
      <h1>Borrowings</h1>
      <p>Track and manage active book loans</p>
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
    _query: { type: String, state: true },
    _committedQuery: { type: String, state: true },
    _status: { type: String, state: true },
  };

  _covers = new CoverController(this);

  constructor() {
    super();
    this.page = 1;
    this.size = 10;
    this._query = '';
    this._committedQuery = '';
    this._status = '';
    this._debounceTimer = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
  }

  borrowingsTask = new Task(this, {
    task: async ([page, size, q, status]) => {
      const data = await getBorrowings({ page, size, q, status });
      this._covers.fetchForBooks(data.data.map(borrowing => borrowing.book));
      return data;
    },
    args: () => [this.page, this.size, this._committedQuery, this._status],
  });

  render() {
    return html`
      ${headerTpl} ${this._toolbarTpl}
      ${this.borrowingsTask.render({
        pending: () => html`<spinner-bks></spinner-bks>`,
        complete: borrowings => this._tableTpl(borrowings),
        error: err => html`<p>Error loading borrowings: ${err.message}</p>`,
      })}
    `;
  }

  get _toolbarTpl() {
    return html`
      <div class="toolbar">
        <div class="quick-filters">
          <span class="quick-filters-label">Quick filters:</span>
          ${QUICK_FILTERS.map(
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
        <input
          name="search"
          type="search"
          placeholder="Search by name, email, or user ID..."
          .value=${this._query}
          @input=${this._handleSearchInput}
        />
      </div>
    `;
  }

  _tableTpl(borrowings) {
    return html`
      <table>
        <thead>
          <tr>
            <th>Book Title</th>
            <th>User</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${
            borrowings.data.length
              ? borrowings.data.map(borrowing => this._rowTpl(borrowing))
              : html`<tr>
                  <td colspan="5" class="empty-state">No borrowings found</td>
                </tr>`
          }
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5">
              <div class="footer-content">
                <span>${paginationText(borrowings.page)}</span>
                <div class="footer-btn-container">
                  <button
                    class="btn-previous"
                    ?disabled=${borrowings.page.page <= 1}
                    @click=${this._handleClickPrevious}
                  >
                    Previous
                  </button>
                  <button
                    class="btn-next"
                    ?disabled=${
                      borrowings.page.page >= borrowings.page.totalPages
                    }
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

  _rowTpl(borrowing) {
    const { book, user } = borrowing;
    const isLate = borrowing.status === 'overdue';

    return html`
      <tr>
        <td>
          <div class="book-detail-container">
            ${this._coverTpl(book)}
            <div class="book-info">
              <span class="book-title">${book.title}</span>
              <span class="book-authors">${book.authors?.join(', ')}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="user-detail-container">
            <span class="user-avatar">
              ${(user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')}
            </span>
            <div class="user-info">
              <span class="user-name">${user.firstName} ${user.lastName}</span>
              <span class="user-id">ID: #BK-${user.id}</span>
            </div>
          </div>
        </td>
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
      </tr>
    `;
  }

  _coverTpl(book) {
    const isbn = book.isbn13 || book.isbn10;
    const coverUrl = isbn ? this._covers.get(isbn) : null;

    return coverUrl
      ? html`<img class="book-cover" src=${coverUrl} alt="${book.title}" />`
      : html`<div class="cover-placeholder">No cover</div>`;
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
