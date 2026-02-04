package chocolate.chocoletter.api.giftbox.controller;

import chocolate.chocoletter.api.giftbox.dto.request.GeneralFreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GeneralQuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.GiftBoxTypeRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialFreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.request.SpecialQuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftbox.dto.response.GiftCountResponseDto;
import chocolate.chocoletter.api.giftbox.service.GiftBoxService;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
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

    @PostMapping("/{giftBoxId}/giftletter/general/free")
    public ResponseEntity<?> sendGeneralFreeGiftLetter(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                        @Valid @RequestBody
                                                        GeneralFreeGiftLetterRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendGeneralFreeGiftLetter(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/giftletter/general/question")
    public ResponseEntity<?> sendGeneralQuestionGiftLetter(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                            @Valid @RequestBody
                                                            GeneralQuestionGiftLetterRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendGeneralQuestionGiftLetter(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/giftletter/special/free")
    public ResponseEntity<?> sendSpecialFreeGiftLetter(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                        @Valid @RequestBody
                                                        SpecialFreeGiftLetterRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendSpecialFreeGiftLetter(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{giftBoxId}/giftletter/special/question")
    public ResponseEntity<?> sendSpecialQuestionGiftLetter(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                            @Valid @RequestBody
                                                            SpecialQuestionGiftLetterRequestDto requestDto, Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftBoxService.sendSpecialQuestionGiftLetter(memberId, giftBoxId, requestDto);
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

    @GetMapping("/{giftBoxId}/sent-giftletter")
    public ResponseEntity<?> findMyGiftLetterDetail(@DecryptedId @PathVariable("giftBoxId") Long giftBoxId,
                                                     Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftLetterDetailResponseDto myGiftLetterDetail = giftBoxService.findMyGiftLetterDetail(giftBoxId, memberId);
        return ResponseEntity.ok(myGiftLetterDetail);
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
