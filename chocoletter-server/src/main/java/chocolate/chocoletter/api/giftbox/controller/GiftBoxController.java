package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.service.GiftBoxService;
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
@RequestMapping("/api/v1/gift-box")
@RequiredArgsConstructor
public class GiftBoxController implements GiftBoxSwagger {
    private final GiftBoxService giftBoxService;

    @PostMapping("/{giftBoxId}/gift/general/free")
    public ResponseEntity<?> sendGeneralFreeGift(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                 @Valid @RequestBody
                                                 GeneralFreeGiftRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendGeneralFreeGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/gift/general/question")
    public ResponseEntity<?> sendGeneralQuestionGift(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                     @Valid @RequestBody
                                                     GeneralQuestionRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendGeneralQuestionGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/gift/special/free")
    public ResponseEntity<?> sendSpecialFreeGift(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                 @Valid @RequestBody
                                                 SpecialFreeGiftRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendSpecialFreeGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/gift/special/question")
    public ResponseEntity<?> sendSpecialQuestionGift(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                     @Valid @RequestBody
                                                     SpecialQuestionGiftRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendSpecialQuestionGift(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
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

    @GetMapping("/{giftBoxId}")
    public ResponseEntity<?> findGiftBox(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId) {
        return ResponseEntity.ok(giftBoxService.findFriendGiftBox(giftBoxId));
    }

    @GetMapping("/{giftBoxId}/sent-letter")
    public ResponseEntity<?> findMyGiftDetail(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                              Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftDetailResponseDto myGiftDetail = giftBoxService.findMyGiftDetail(giftBoxId, memberId);
        return ResponseEntity.ok(myGiftDetail);
    }

    @GetMapping("/id")
    public ResponseEntity<?> getGiftBoxId(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(giftBoxService.findGiftBoxIdByMemberId(memberId));
    }

    @GetMapping("/{giftBoxId}/verify")
    public ResponseEntity<?> verifyIsSend(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(giftBoxService.findVerifyIsSend(giftBoxId, memberId));
    }

    @PatchMapping("/type")
    public ResponseEntity<?> chooseGiftBoxType(@RequestBody @Valid GiftBoxTypeRequestDto requestDto,
                                               Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.chooseGiftBoxType(memberId, requestDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/type")
    public ResponseEntity<?> findGiftBoxType(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        return ResponseEntity.ok().body(giftBoxService.findGiftBoxTypeByMemberId(memberId));
    }
}
