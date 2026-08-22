import { vi } from 'vitest';
import type { LitElement } from 'lit';

/**
 * Creates the element, attaches it, and waits for the first render.
 *
 * The await is where Lit's development build throws if a reactive property is
 * shadowed by a class field — see test/lit-class-fields.spec.ts.
 */
export async function mount<T extends LitElement = LitElement>(
  tag: string,
): Promise<T> {
  const el = document.createElement(tag) as T;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

/** Lets a component settle after a fetch resolves inside connectedCallback. */
export async function settle(el: LitElement, rounds = 2): Promise<void> {
  for (let i = 0; i < rounds; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await el.updateComplete;
  }
}

export interface StubbedResponse {
  ok?: boolean;
  status?: number;
  body?: unknown;
}

/**
 * Replaces global fetch for the duration of a test. The route handler receives
 * the request URL and returns what the API would.
 *
 * Unstubbed automatically by test/setup.ts.
 */
export function stubFetch(
  route: (url: string) => StubbedResponse,
): ReturnType<typeof vi.fn> {
  const stub = vi.fn(async (input: RequestInfo | URL) => {
    const { ok = true, status = 200, body = null } = route(String(input));
    return {
      ok,
      status,
      json: async () => body,
      text: async () => JSON.stringify(body),
      blob: async () => new Blob(),
    } as unknown as Response;
  });

  vi.stubGlobal('fetch', stub);
  return stub;
}

/** Fetch stub that answers every route with an empty, successful payload. */
export function stubFetchEmpty(): ReturnType<typeof vi.fn> {
  return stubFetch(() => ({ body: [] }));
}
