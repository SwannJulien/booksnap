import { describe, it, expect } from 'vitest';
import { returnBorrowing } from '../../src/api/borrowing.js';
import { stubFetch } from '../helpers.js';

/**
 * The `error.status` convention, pinned before TS-005 replaces it with an
 * ApiError class.
 *
 * A 409 on return means the copy was already returned by someone else, and the
 * UI distinguishes it from a generic failure. That distinction is carried by a
 * property bolted onto an Error — nothing in the type system holds it in place
 * today, and nothing but these tests will notice if TS-005 drops it.
 */
describe('api/borrowing — returnBorrowing', () => {
  it('attaches status so a conflict can be told apart', async () => {
    stubFetch(() => ({
      ok: false,
      status: 409,
      body: { message: 'Copy was already returned' },
    }));

    await expect(returnBorrowing(42)).rejects.toMatchObject({
      message: 'Copy was already returned',
      status: 409,
    });
  });

  it('still attaches status when the body carries no message', async () => {
    stubFetch(() => ({ ok: false, status: 500, body: {} }));

    const error = await returnBorrowing(42).catch((e: unknown) => e);
    expect(error).toMatchObject({ status: 500 });
    expect((error as Error).message).toMatch(/500/);
  });

  it('resolves the payload on success', async () => {
    stubFetch(() => ({ body: { id: 42, status: 'returned' } }));

    await expect(returnBorrowing(42)).resolves.toEqual({
      id: 42,
      status: 'returned',
    });
  });
});
