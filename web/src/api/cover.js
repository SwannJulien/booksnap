import { API_BASE_URL, API_ROUTES } from './api-routes.js';

export async function getCover(isbn) {
  try {
    const response = await fetch(
      `${API_BASE_URL.LOCAL}${API_ROUTES.COVERS}/${encodeURIComponent(isbn)}`,
      {
        method: 'GET',
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch cover: ${response.statusText}`);
    }

    // Convert the response to a Blob (raw file data)
    const blob = await response.blob();

    // Return the blob which can be used to create an object URL
    return { status: response.status, blob };
  } catch (error) {
    throw new Error(`Failed to get cover: ${error.message}`);
  }
}

export async function uploadCover(coverSource, isbn) {
  try {
    let imageBlob;

    // Check if it's a Blob/File or a URL string
    if (coverSource instanceof Blob) {
      // Already a Blob/File, use it directly
      imageBlob = coverSource;
    } else if (typeof coverSource === 'string') {
      // It's a URL, fetch it
      const imageResponse = await fetch(coverSource);
      if (!imageResponse.ok) {
        throw new Error(
          `Failed to fetch cover image: ${imageResponse.statusText}`,
        );
      }
      imageBlob = await imageResponse.blob();
    } else {
      throw new Error('Invalid cover source type');
    }

    // Upload the binary image to the backend with ISBN as query parameter
    const response = await fetch(
      `${API_BASE_URL.LOCAL}${API_ROUTES.COVERS}?isbn=${encodeURIComponent(isbn)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': imageBlob.type,
        },
        body: imageBlob,
      },
    );

    // Handle response - backend may return empty body or non-JSON content
    let body = null;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        try {
          body = JSON.parse(text);
        } catch (err) {
          body = text;
        }
      }
    } else {
      const text = await response.text();
      body = text || null;
    }

    const res = { status: response.status, body };
    return res;
  } catch (error) {
    throw new Error(`Failed to upload cover: ${error}`);
  }
}
