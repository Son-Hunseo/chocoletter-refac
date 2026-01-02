package chocolate.chocoletter.api.member.controller;

import chocolate.chocoletter.api.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController implements AuthSwagger {

    private final MemberService memberService;

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {

        /**
         * 추후 리프레시 토큰을 만들거기 때문에
         * 해당 리프레시 토큰을 블랙리스트에 (레디스에)등록하는 것 필요 (레디스로 주기적으로 삭제)
         */

        return ResponseEntity.ok().build();
    }
}