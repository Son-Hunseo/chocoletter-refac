package chocoletter.chat.common.util;

import java.nio.ByteBuffer;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class IdEncryptionUtil {

    private static final String ALGORITHM = "AES";

    @Value("${encrypt.secret-key}")
    private String secretKey;

    public String encrypt(Long value) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        byte[] valueBytes = ByteBuffer.allocate(Long.BYTES).putLong(value).array();
        byte[] encryptedData = cipher.doFinal(valueBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedData);
    }

    public Long decrypt(String encryptedData) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
        byte[] decodedData = Base64.getUrlDecoder().decode(encryptedData);
        byte[] decryptedBytes = cipher.doFinal(decodedData);
        return ByteBuffer.wrap(decryptedBytes).getLong();
    }
}
