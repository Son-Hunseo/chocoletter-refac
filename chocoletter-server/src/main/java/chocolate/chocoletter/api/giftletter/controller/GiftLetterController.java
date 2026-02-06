package chocolate.chocoletter.api.giftletter.controller;

import chocolate.chocoletter.api.giftletter.dto.request.FreeGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.request.ModifyGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.request.QuestionGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLettersResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.VerifyIsSendResponseDto;
import chocolate.chocoletter.api.giftletter.service.GiftLetterService;
import chocolate.chocoletter.common.annotation.DecryptedId;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/giftletter")
@RequiredArgsConstructor
public class GiftLetterController implements GiftLetterSwagger {
    private final GiftLetterService giftLetterService;

    /**
     * 조회
     */

    @GetMapping("/all")
    public ResponseEntity<?> findAllGiftLetters(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftLettersResponseDto giftLetters = giftLetterService.findAllGiftLetters(memberId);
        return ResponseEntity.ok(giftLetters);
    }

    @GetMapping("/{giftLetterId}/receive")
    public ResponseEntity<?> findReceiveGiftLetterDetail(@DecryptedId @PathVariable("giftLetterId") Long giftLetterId,
                                                         Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftLetterDetailResponseDto giftLetter = giftLetterService.findReceiveGiftLetterDetail(memberId, giftLetterId);
        return ResponseEntity.ok(giftLetter);
    }

    @GetMapping("/{giftLetterId}/send")
    public ResponseEntity<?> findSendGiftLetterDetail(@DecryptedId @PathVariable("giftLetterId") Long giftLetterId,
                                                      Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftLetterDetailResponseDto giftLetter = giftLetterService.findSendGiftLetterDetail(memberId, giftLetterId);
        return ResponseEntity.ok(giftLetter);
    }

    @GetMapping("/sent")
    public ResponseEntity<?> findMyGiftLetterDetail(@DecryptedId @RequestParam("giftBoxId") Long giftBoxId,
                                                    Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        GiftLetterDetailResponseDto responseDto = giftLetterService.findMyGiftLetterDetail(giftBoxId, memberId);
        return ResponseEntity.ok(responseDto);
    }

    /**
     * 전송
     */

    @PostMapping("/free")
    public ResponseEntity<?> sendFreeGiftLetter(@DecryptedId @RequestParam("giftBoxId") Long giftBoxId,
                                                 @RequestBody FreeGiftLetterRequestDto requestDto,
                                                 Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftLetterService.sendFreeGiftLetter(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/question")
    public ResponseEntity<?> sendQuestionGiftLetter(@DecryptedId @RequestParam("giftBoxId") Long giftBoxId,
                                                     @RequestBody QuestionGiftLetterRequestDto requestDto,
                                                     Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftLetterService.sendQuestionGiftLetter(memberId, giftBoxId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * 수정
     */

    @PatchMapping("/{giftLetterId}")
    public ResponseEntity<?> modifyGiftLetter(@DecryptedId @PathVariable Long giftLetterId,
                                              @RequestBody ModifyGiftLetterRequestDto requestDto,
                                              Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftLetterService.modifyGiftLetterById(memberId, giftLetterId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * 이미 대상에게 편지를 보냈는지 검증
     */

    @GetMapping("/verify")
    public ResponseEntity<?> verifyIsSend(@DecryptedId @RequestParam("giftBoxId") Long giftBoxId,
                                           Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        VerifyIsSendResponseDto responseDto = giftLetterService.verifyIsSend(giftBoxId, memberId);
        return ResponseEntity.ok(responseDto);
    }

    /**
     * 랜덤 질문 조회
     */

    @GetMapping("/question")
    public ResponseEntity<?> findRandomQuestion(@RequestParam Long previousQuestionId) {
        RandomQuestionResponseDto randomQuestion = giftLetterService.findRandomQuestion(previousQuestionId);
        return ResponseEntity.ok(randomQuestion);
    }

    /**
     * 특정 선물함의 선물 갯수 조회
     */

    @GetMapping("/count")
    public ResponseEntity<?> countGiftLetterByGiftBoxId(@DecryptedId @RequestParam("giftBoxId") Long giftBoxId) {
        Long giftCount = giftLetterService.countGiftLetterByGiftBoxId(giftBoxId);
        return ResponseEntity.ok(giftCount);
    }
}
