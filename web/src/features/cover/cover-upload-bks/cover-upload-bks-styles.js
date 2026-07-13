import { css } from 'lit';

export const coverUploadStyles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  .cover-wrapper {
    position: relative;
    display: inline-block;
  }

  .cover-preview {
    max-width: 20rem;
    max-height: 15rem;
    border-radius: var(--border-radius-default);
    box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.18),
      0 2px 6px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba(0, 0, 0, 0.08);
    object-fit: cover;
    display: block;
  }

  .no-cover-container {
    display: flex;
    padding: 1rem;
    width: 100px;
    height: 150px;
    background-color: gray;
  }

  .no-cover {
    align-content: center;
    text-align: center;
  }

  .cover-input {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }
`;
