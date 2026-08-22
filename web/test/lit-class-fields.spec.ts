import { describe, it, expect } from 'vitest';
import { LitElement, html } from 'lit';
import { mount } from './helpers.js';

/**
 * An executable statement of the TS-011 `declare` pattern.
 *
 * With useDefineForClassFields: true (the default at target ES2022, and set
 * explicitly in tsconfig.json), a declared class field emits a [[Define]] that
 * installs an own data property over the accessor Lit puts on the prototype.
 * The component renders, and never updates again.
 *
 * Both classes below compile clean under `strict`. Only one of them works.
 * If this file ever goes red, the assumption the migration rests on has moved.
 */

/** The pattern to use: `declare` emits nothing, the constructor assigns. */
class GoodExampleBks extends LitElement {
  static override properties = { label: { type: String } };

  declare label: string;

  constructor() {
    super();
    this.label = 'initial';
  }

  override render() {
    return html`<p>${this.label}</p>`;
  }
}
customElements.define('good-example-bks', GoodExampleBks);

/** The mistake: an ordinary class field shadows the reactive accessor. */
class ShadowedExampleBks extends LitElement {
  static override properties = { label: { type: String } };

  label = 'initial';

  override render() {
    return html`<p>${this.label}</p>`;
  }
}
customElements.define('shadowed-example-bks', ShadowedExampleBks);

describe('the declare pattern', () => {
  it('renders and stays reactive', async () => {
    const el = await mount('good-example-bks');
    expect(el.shadowRoot!.textContent).toContain('initial');

    (el as GoodExampleBks).label = 'changed';
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).toContain('changed');
  });

  it('is what makes the smoke test able to catch a shadowed field', async () => {
    await expect(mount('shadowed-example-bks')).rejects.toThrow(
      /set using class fields: label/,
    );
  });
});
