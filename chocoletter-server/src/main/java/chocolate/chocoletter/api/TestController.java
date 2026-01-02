package chocolate.chocoletter.api;

import chocolate.chocoletter.common.util.IdEncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    private final IdEncryptionUtil idEncryptionUtil;

    @GetMapping("/{id}")
    public ResponseEntity<?> getEncryptedId(@PathVariable Long id) {
        return ResponseEntity.ok(idEncryptionUtil.encrypt(id));
    }
}
