package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.service.GiftBoxService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gift-box")
@RequiredArgsConstructor
public class GiftBoxController implements GiftBoxSwagger {
    private final GiftBoxService giftBoxService;

    @GetMapping("/{giftBoxId}")
    public ResponseEntity<?> findGiftBox(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId) {
        return ResponseEntity.ok(giftBoxService.findFriendGiftBox(giftBoxId));
    }

    @GetMapping("/id")
    public ResponseEntity<?> getGiftBoxId(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(giftBoxService.findGiftBoxIdByMemberId(memberId));
    }

    @GetMapping("/type")
    public ResponseEntity<?> findGiftBoxType(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok().body(giftBoxService.findGiftBoxTypeByMemberId(memberId));
    }

    @PatchMapping("/type")
    public ResponseEntity<?> chooseGiftBoxType(@RequestBody @Valid GiftBoxTypeRequestDto requestDto,
                                               Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.chooseGiftBoxType(memberId, requestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<?> findGiftCount(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftCountResponseDto responseDto = giftBoxService.findGiftCount(memberId);
        return ResponseEntity.ok(responseDto);
    }

    @PatchMapping("/preview")
    public ResponseEntity<?> usePreviewCount(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.usePreviewCount(memberId);
        return ResponseEntity.ok().build();
    }
}
