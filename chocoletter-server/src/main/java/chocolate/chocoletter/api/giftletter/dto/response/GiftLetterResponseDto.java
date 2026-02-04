package chocolate.chocoletter.api.giftletter.dto.response;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import lombok.Builder;

@Builder
public record GiftLetterResponseDto(String giftLetterId, Boolean isOpened) {
    public static GiftLetterResponseDto of(GiftLetter giftLetter, String encryptedGiftLetterId) {
        return GiftLetterResponseDto.builder()
                .giftLetterId(encryptedGiftLetterId)
                .isOpened(giftLetter.getIsOpened())
                .build();
    }
}
