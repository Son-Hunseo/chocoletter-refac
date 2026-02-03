package chocolate.chocoletter.api.gift.controller;

import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gift")
@RequiredArgsConstructor
public class GiftController implements GiftSwagger {
    private final GiftService giftService;

    @GetMapping("/all")
    public ResponseEntity<?> findAllGifts(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftsResponseDto gifts = giftService.findAllGifts(memberId);
        return ResponseEntity.ok(gifts);
    }

    @GetMapping("/{giftId}/receive")
    public ResponseEntity<?> findReceiveGiftDetail(@DecryptedId @PathVariable("giftId") Long giftId,
                                                   Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftDetailResponseDto gift = giftService.findReceiveGiftDetail(memberId, giftId);
        return ResponseEntity.ok(gift);
    }

    @GetMapping("/{giftId}/send")
    public ResponseEntity<?> findSendGiftDetail(@DecryptedId @PathVariable("giftId") Long giftId, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftDetailResponseDto gift = giftService.findSendGiftDetail(memberId, giftId);
        return ResponseEntity.ok(gift);
    }

    @PatchMapping("/{giftId}/letter")
    public ResponseEntity<?> modifyGift(@DecryptedId @PathVariable Long giftId,
                                        @RequestBody ModifyLetterRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftService.modifyGift(memberId, giftId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
