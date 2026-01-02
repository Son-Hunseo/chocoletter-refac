package chocolate.chocoletter.api.gift.controller;

import chocolate.chocoletter.api.gift.dto.request.ModifyLetterRequestDto;
import chocolate.chocoletter.api.gift.dto.request.UnboxingInvitationRequestDto;
import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftUnboxingInvitationResponseDto;
import chocolate.chocoletter.api.gift.dto.response.GiftsResponseDto;
import chocolate.chocoletter.api.gift.service.GiftService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
        // 로그인 한 member를 가져오기
        Long memberId = Long.parseLong(principal.getName());
        GiftsResponseDto gifts = giftService.findAllGifts(memberId);
        return ResponseEntity.ok(gifts);
    }

    @GetMapping("/special")
    public ResponseEntity<?> findSpecialGifts(Principal principal) {
        // 로그인 한 member를 가져오기
        Long memberId = Long.parseLong(principal.getName());
        GiftsResponseDto gifts = giftService.findSpecialGifts(memberId);
        return ResponseEntity.ok(gifts);
    }

    @GetMapping("/general")
    public ResponseEntity<?> findGeneralGifts(Principal principal) {
        // 로그인 한 member를 가져오기
        Long memberId = Long.parseLong(principal.getName());
        GiftsResponseDto gifts = giftService.findGeneralGifts(memberId);
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

    @GetMapping("/{giftId}/unboxing/invitation")
    public ResponseEntity<?> findUnboxingInvitation(@DecryptedId @PathVariable Long giftId, Principal principal) {
        // 로그인 한 member를 가져오기
        Long memberId = Long.parseLong(principal.getName());
        GiftUnboxingInvitationResponseDto unboxingInvitation = giftService.findUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok(unboxingInvitation);
    }

    @PostMapping("/{giftId}/unboxing/invitation")
    public ResponseEntity<?> sendUnboxingInvitation(@DecryptedId @PathVariable Long giftId,
                                                    @RequestBody @Valid UnboxingInvitationRequestDto requestDto,
                                                    Principal principal) {
        // 로그인 한 유저가 sender
        Long senderId = Long.parseLong(principal.getName());
        giftService.sendUnboxingInvitation(senderId, giftId, requestDto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/unboxing/invitation/accept")
    public ResponseEntity<?> acceptUnboxingInvitation(@DecryptedId @PathVariable Long giftId, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftService.acceptUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/unboxing/invitation/reject")
    public ResponseEntity<?> rejectUnboxingInvitation(@DecryptedId @PathVariable Long giftId, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftService.rejectUnboxingInvitation(memberId, giftId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{giftId}/type")
    public ResponseEntity<?> changeToGeneralGift(@DecryptedId @PathVariable Long giftId, Principal principal) {
        // 초대를 보낸 유저로 로그인을 한다고 가정
        Long memberId = Long.parseLong(principal.getName());
        giftService.changeToGeneralGift(memberId, giftId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{giftId}/letter")
    public ResponseEntity<?> modifyGift(@DecryptedId @PathVariable Long giftId,
                                        @RequestBody ModifyLetterRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftService.modifyGift(memberId, giftId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
