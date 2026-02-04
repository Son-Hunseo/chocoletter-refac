package chocolate.chocoletter.api.giftletter.controller;

import chocolate.chocoletter.api.giftletter.dto.request.ModifyGiftLetterRequestDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLettersResponseDto;
import chocolate.chocoletter.api.giftletter.dto.response.RandomQuestionResponseDto;
import chocolate.chocoletter.api.giftletter.service.GiftLetterService;
import chocolate.chocoletter.common.annotation.DecryptedId;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/giftletter")
@RequiredArgsConstructor
public class GiftLetterController implements GiftLetterSwagger {
    private final GiftLetterService giftLetterService;

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

    @PatchMapping("/{giftLetterId}")
    public ResponseEntity<?> modifyGiftLetter(@DecryptedId @PathVariable Long giftLetterId,
                                               @RequestBody ModifyGiftLetterRequestDto requestDto,
                                               Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        giftLetterService.modifyGiftLetterById(memberId, giftLetterId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/question")
    public ResponseEntity<?> findRandomQuestion(@RequestParam @Min(0) @Max(40) Long previousQuestionId) {
        RandomQuestionResponseDto randomQuestion = giftLetterService.findRandomQuestion(previousQuestionId);
        return ResponseEntity.ok(randomQuestion);
    }
}
