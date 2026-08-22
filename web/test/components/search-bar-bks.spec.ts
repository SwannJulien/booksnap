import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/search-bar-bks/search-bar-bks.js';
import { mount, settle, stubFetch } from '../helpers.js';

/**
 * search-bar-bks is the shared component with the most surface: reactive props
 * and internal state, styles, a shadowRoot.querySelector, composed events, and
 * a fetch on connectedCallback. If a converted component is going to misbehave
 * in a way the smoke test misses, it looks like one of these.
 */
describe('search-bar-bks', () => {
  beforeEach(() => {
    stubFetch(url => {
      if (url.includes('/copies/statuses')) {
        return { body: ['available', 'borrowed', 'on_hold'] };
      }
      if (url.includes('/genres/search')) {
        return { body: ['Fantasy', 'Fiction'] };
      }
      return { ok: false, status: 404, body: {} };
    });
  });

  it('renders the search input and the availability filter', async () => {
    const el = await mount('search-bar-bks');

    expect(el.shadowRoot!.querySelector('input[name="search"]')).not.toBeNull();
    expect(
      el.shadowRoot!.querySelector('select[name="availability"]'),
    ).not.toBeNull();
  });

  it('reflects the query property into the input', async () => {
    const el = await mount('search-bar-bks');

    (el as unknown as { query: string }).query = 'Harry';
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="search"]',
    );
    expect(input!.value).toBe('Harry');
  });

  it('fills the availability filter from the API', async () => {
    const el = await mount('search-bar-bks');
    await settle(el);

    const options = [
      ...el.shadowRoot!.querySelectorAll('select[name="availability"] option'),
    ].map(o => o.textContent?.trim());

    expect(options).toContain('Available');
    expect(options).toContain('On hold');
  });

  it('emits search-input across the shadow boundary', async () => {
    const el = await mount('search-bar-bks');

    const seen: string[] = [];
    document.addEventListener('search-input', event => {
      seen.push((event as CustomEvent<{ value: string }>).detail.value);
    });

    const input = el.shadowRoot!.querySelector<HTMLInputElement>(
      'input[name="search"]',
    )!;
    input.value = 'Tolkien';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(seen).toEqual(['Tolkien']);
  });
});
