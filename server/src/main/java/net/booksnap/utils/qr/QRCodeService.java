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

@Service
public class QRCodeService {

    private static final int QR_CODE_SIZE = 200;

    public byte[] generateCopyQRCode(Copy copy) {
        try {
            String qrContent = copy.getCodeIdentification();

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, QR_CODE_SIZE, QR_CODE_SIZE);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code for copy ID: " + copy.getId(), e);
        }
    }

    public String generateCopyIdentificationCode(Copy copy) {
        return String.format("COPY:%d:BOOK:%d:CHK:%s",
            copy.getId(),
            copy.getBook().getId(),
            generateChecksum(copy.getId()));
    }

    private String generateChecksum(Long copyId) {
        String hex = Integer.toHexString(copyId.hashCode());
        // Ensure we have at least 4 characters by padding with zeros if needed
        while (hex.length() < 4) {
            hex = "0" + hex;
        }
        // Take the last 4 characters to ensure we always get 4 chars
        return hex.substring(Math.max(0, hex.length() - 4)).toUpperCase();
    }

    public boolean validateQRCode(String qrContent) {
        try {
            String[] parts = qrContent.split(":");
            if (parts.length != 8) return false;
            if (!"COPY".equals(parts[0])) return false;
            if (!"BOOK".equals(parts[2])) return false;
            if (!"CHK".equals(parts[4])) return false;

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
}