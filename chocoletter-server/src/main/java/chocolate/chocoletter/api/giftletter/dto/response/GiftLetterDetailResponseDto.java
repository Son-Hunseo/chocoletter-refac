package chocolate.chocoletter.api.giftletter.dto.response;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.domain.LetterType;
import lombok.Builder;

@Builder
public record GiftLetterDetailResponseDto(
        String giftLetterId,
        LetterType type,
        String nickName,
        String content,
        String question,
        String answer) {

    public static GiftLetterDetailResponseDto of(String encryptedGiftLetterId, GiftLetter giftLetter,
                                                  String decryptedContent, String decryptedAnswer) {
        return GiftLetterDetailResponseDto.builder()
                .giftLetterId(encryptedGiftLetterId)
                .type(giftLetter.getType())
                .nickName(giftLetter.getNickname())
                .content(decryptedContent)
                .question(giftLetter.getQuestion())
                .answer(decryptedAnswer)
                .build();
    }
}
