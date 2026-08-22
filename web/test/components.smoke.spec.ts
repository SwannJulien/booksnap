import { describe, it, expect, beforeAll } from 'vitest';
import { mount, stubFetchEmpty } from './helpers.js';

/**
 * The migration's regression gate.
 *
 * Every component is imported and mounted once. That is enough to catch the
 * bug TS-011 warns about — a class field shadowing a Lit reactive accessor —
 * because Lit's development build checks every declared reactive property at
 * connectedCallback and throws:
 *
 *   "The following properties on element <tag> will not trigger updates as
 *    expected because they are set using class fields: ..."
 *
 * That bug produces no compile error and no visible symptom beyond a component
 * that silently stops updating, so this file is the only thing standing
 * between a converted component and a silent regression.
 *
 * The list is discovered, not written down: converting a component from .js to
 * .ts keeps it covered, and adding one covers it automatically.
 */

const modules = import.meta.glob('../src/{components,features,views}/**/*.{js,ts}');

const COMPONENT_PATHS = Object.keys(modules)
  .filter(path => !/-styles\.(js|ts)$/.test(path))
  .sort();

/** Convention: foo-bar.js in foo-bar/ defines the tag <foo-bar>. */
function tagOf(path: string): string {
  return path.split('/').pop()!.replace(/\.(js|ts)$/, '');
}

beforeAll(async () => {
  await Promise.all(COMPONENT_PATHS.map(path => modules[path]!()));
});

describe('every component mounts', () => {
  it('found the component set', () => {
    // Guards against a glob that silently stops matching anything.
    expect(COMPONENT_PATHS.length).toBeGreaterThanOrEqual(27);
  });

  it.each(COMPONENT_PATHS)('%s', async path => {
    const tag = tagOf(path);

    // If this fails, either the file does not define an element (move it out of
    // components/, features/ or views/) or it breaks the naming convention.
    expect(customElements.get(tag), `${tag} is not registered`).toBeDefined();

    stubFetchEmpty();
    const el = await mount(tag);

    expect(el.shadowRoot).not.toBeNull();
  });
});
