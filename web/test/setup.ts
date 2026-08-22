import { afterEach } from 'vitest';
import { vi } from 'vitest';

/**
 * Browser APIs happy-dom does not implement, stubbed to the minimum the
 * components actually use. Each entry is a gap in the environment, not a
 * project shim — keep it that way, and keep it short.
 */

// ElementInternals: button-bks calls attachInternals() in its constructor and
// reads internals.form to forward a submit. Without this, every component that
// renders a <button-bks> fails to construct.
if (!HTMLElement.prototype.attachInternals) {
  HTMLElement.prototype.attachInternals = function attachInternals(
    this: HTMLElement,
  ) {
    return {
      form: this.closest('form'),
      setFormValue() {},
      setValidity() {},
      checkValidity: () => true,
      reportValidity: () => true,
      states: new Set<string>(),
    } as unknown as ElementInternals;
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
