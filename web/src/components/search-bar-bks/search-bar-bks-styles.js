import { css } from 'lit';

export const searchBarBksStyles = css`
  :host {
    display: block;
  }

  .searchbar-container {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr auto;
    gap: 0.75rem;
    background-color: var(--clr-card-gray);
    padding: 1.2rem;
    border-radius: var(--border-radius-default);
    align-items: center;
  }

  input,
  select {
    background-color: var(--clr-main-dark);
    color: var(--clr-text-light);
    width: 100%;
    box-sizing: border-box;
  }

  .searchbar-container input {
    background-repeat: no-repeat;
    background-position: left 10px center;
    background-size: 26px;
  }

  input[name='search'] {
    background-image: url('../../../assets/search.svg');
    padding-left: 40px;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url('../../../assets/arrow_down.svg');
    background-repeat: no-repeat;
    background-position: right 6px center;
    background-size: 26px;
    cursor: pointer;
  }

  button {
    background-color: var(--clr-main-dark);
    border: 1px solid var(--clr-border);
    border-radius: var(--border-radius-default);
    padding: 0.5rem;
    height: 43px;
  }

  /* Availability wrapper */
  .availability-wrapper {
    position: relative;
  }

  .availability-clear {
    position: absolute;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--clr-text-light);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 4px;
    height: auto;
    line-height: 1;
  }

  /* Genre autocomplete */
  .genre-autocomplete {
    position: relative;
  }

  input[name='genre'] {
    width: 100%;
    box-sizing: border-box;
  }

  input[name='genre']:-webkit-autofill,
  input[name='genre']:-webkit-autofill:hover,
  input[name='genre']:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px var(--clr-main-dark) inset;
    -webkit-text-fill-color: var(--clr-text-light);
  }

  .genre-clear {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--clr-text-light);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 4px;
    height: auto;
    line-height: 1;
  }

  .genre-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: var(--clr-main-dark);
    border: 1px solid var(--clr-border);
    border-radius: var(--border-radius-default);
    margin: 4px 0 0;
    padding: 0;
    list-style: none;
    max-height: 200px;
    overflow-y: auto;
  }

  .genre-dropdown li {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    color: var(--clr-text-light);
  }

  .genre-dropdown li:hover {
    background-color: var(--clr-card-gray);
  }
`;
