package net.booksnap.domain.cover.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class CoverServiceImpl implements CoverService {

    private static final Logger log = LoggerFactory.getLogger(CoverServiceImpl.class);

    @Value("${bunny.api.key}")
    private String bunnyApiKey;

    @Override
    public void uploadCoverImage(byte[] imageData, String isbn) {
        try {
            log.info("Uploading cover for ISBN: {} (size: {} bytes)", isbn, imageData.length);

            String fileName = isbn + ".jpg";
            String urlString = "https://storage.bunnycdn.com/booksnap-storage/" + fileName;

            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("PUT");
            connection.setRequestProperty("AccessKey", bunnyApiKey);
            connection.setRequestProperty("Content-Type", "application/octet-stream");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(imageData);
                os.flush();
            }

            int responseCode = connection.getResponseCode();

            if (responseCode != HttpURLConnection.HTTP_CREATED && responseCode != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed to upload cover image to BunnyCDN. Response code: " + responseCode);
            }

            connection.disconnect();
            log.info("Successfully uploaded cover for ISBN: {} to {}", isbn, fileName);

        } catch (Exception e) {
            log.error("Error uploading cover image to BunnyCDN for ISBN: {}", isbn, e);
            throw new RuntimeException("Error uploading cover image to BunnyCDN", e);
        }
    }

    @Override
    public byte[] getCoverImage(String isbn) {
        try {
            log.info("Fetching cover image for ISBN: {}", isbn);

            String fileName = isbn + ".jpg";
            String urlString = "https://storage.bunnycdn.com/booksnap-storage/" + fileName;

            URL url = new URL(urlString);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("AccessKey", bunnyApiKey);

            int responseCode = connection.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                byte[] imageData = connection.getInputStream().readAllBytes();
                log.info("Successfully fetched cover for ISBN: {} ({} bytes)", isbn, imageData.length);
                connection.disconnect();
                return imageData;
            } else if (responseCode == HttpURLConnection.HTTP_NOT_FOUND) {
                connection.disconnect();
                log.warn("Cover image not found for ISBN: {}", isbn);
                throw new RuntimeException("Cover image not found for ISBN: " + isbn);
            } else {
                connection.disconnect();
                throw new RuntimeException("Failed to fetch cover image from BunnyCDN. Response code: " + responseCode);
            }

        } catch (Exception e) {
            log.error("Error fetching cover image from BunnyCDN for ISBN: {}", isbn, e);
            throw new RuntimeException("Error fetching cover image from BunnyCDN", e);
        }
    }

}
