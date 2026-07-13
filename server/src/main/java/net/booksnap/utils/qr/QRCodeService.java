package net.booksnap.utils.qr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import net.booksnap.domain.copy.Copy;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collection;

@Service
public class QRCodeService {

    private static final int QR_CODE_SIZE = 200;

    public byte[]   generateCopyQRCode(Copy copy) {
        try {
            String qrContent = String.format("COPY:%d:LIB:%d:BOOK:%d:CHK:%s",
                copy.getId(),
                copy.getLibrary().getId(),
                copy.getBook().getId(),
                generateChecksum(copy.getId()));

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code for copy ID: " + copy.getId(), e);
        }
    }

    /**
     * Generates identification code from section name and author names.
     * Format: first 3 letters of section name + "-" + first 3 letters of first author's surname
     * Example: "Fiction" + ["J.K. Rowling", "Other Author"] = "FIC-ROW"
     */
    public String generateIdentificationCode(String sectionName, Collection<String> authorNames) {
        String sectionPart = getFirstThreeLetters(sectionName);
        String authorPart = getAuthorSurnamePart(authorNames);
        return sectionPart + "-" + authorPart;
    }

    private String generateChecksum(Long copyId) {
        String hex = Integer.toHexString(copyId.hashCode());
        while (hex.length() < 4) {
            hex = "0" + hex;
        }
        return hex.substring(Math.max(0, hex.length() - 4)).toUpperCase();
    }

    public boolean validateQRCode(String qrContent) {
        try {
            String[] parts = qrContent.split(":");
            if (parts.length != 8) return false;
            if (!"COPY".equals(parts[0])) return false;
            if (!"LIB".equals(parts[2])) return false;
            if (!"BOOK".equals(parts[4])) return false;
            if (!"CHK".equals(parts[6])) return false;

            Long copyId = Long.parseLong(parts[1]);
            String providedChecksum = parts[7];
            String expectedChecksum = generateChecksum(copyId);

            return expectedChecksum.equals(providedChecksum);
        } catch (Exception e) {
            return false;
        }
    }

    public Long extractCopyIdFromQRCode(String qrContent) {
        if (!validateQRCode(qrContent)) {
            throw new IllegalArgumentException("Invalid QR code format");
        }
        String[] parts = qrContent.split(":");
        return Long.parseLong(parts[1]);
    }

    private String getFirstThreeLetters(String text) {
        if (text == null || text.isBlank()) {
            return "UNK";
        }
        String cleaned = text.trim().toUpperCase().replaceAll("[^A-Z]", "");
        if (cleaned.length() >= 3) {
            return cleaned.substring(0, 3);
        }
        // Pad with 'X' if less than 3 characters
        return String.format("%-3s", cleaned).replace(' ', 'X');
    }

    private String getAuthorSurnamePart(Collection<String> authorNames) {
        if (authorNames == null || authorNames.isEmpty()) {
            return "UNK";
        }
        // Get the first author's surname (last word in their name)
        String firstAuthorName = authorNames.iterator().next();
        if (firstAuthorName == null || firstAuthorName.isBlank()) {
            return "UNK";
        }
        String[] nameParts = firstAuthorName.trim().split("\\s+");
        String surname = nameParts[nameParts.length - 1]; // Get last word as surname
        return getFirstThreeLetters(surname);
    }
}