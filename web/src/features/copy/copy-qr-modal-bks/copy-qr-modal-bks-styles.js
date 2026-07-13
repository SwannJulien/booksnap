import { css } from 'lit';

export const copyQrModalBksStyles = css`
  .qr-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .qr-modal-content .qr-code {
    width: fit-content;
    margin-inline: auto;
    margin-bottom: 1rem;
  }

  .qr-modal-content .print-btn {
    margin-inline: auto;
  }

  @media print {
    .qr-modal-content > *:not(.qr-code):not(p) {
      display: none !important;
    }

    .qr-code {
      display: block;
      max-width: 100%;
      page-break-inside: avoid;
    }
  }
`;
