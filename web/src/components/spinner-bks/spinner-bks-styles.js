import { css } from 'lit';

export const spinnerBksStyles = css`
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(52, 211, 153, 1);
    border-top: 4px solid black;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
