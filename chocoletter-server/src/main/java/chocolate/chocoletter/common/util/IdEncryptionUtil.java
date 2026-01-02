package chocolate.chocoletter.common.util;

import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.InternalServerException;
import java.nio.ByteBuffer;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class IdEncryptionUtil {

    private static final String ALGORITHM = "AES";

    @Value("${encrypt.secret-key}")
    private String secretKey;

    public String encrypt(Long value) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            byte[] valueBytes = ByteBuffer.allocate(Long.BYTES).putLong(value).array();
            byte[] encryptedData = cipher.doFinal(valueBytes);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedData);
        } catch (Exception e) {
            log.error("ID ENCRYPTION ERROR", e);
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ENCRYPTION_ERROR);
        }
    }

    public Long decrypt(String encryptedData) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            byte[] decodedData = Base64.getUrlDecoder().decode(encryptedData);
            byte[] decryptedBytes = cipher.doFinal(decodedData);
            return ByteBuffer.wrap(decryptedBytes).getLong();
        } catch (Exception e) {
            log.error("ID DECRYPTION ERROR", e);
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR);
        }
    }
}
