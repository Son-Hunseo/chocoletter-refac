package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.gift.domain.Gift;
import lombok.Builder;

@Builder
public record GiftResponseDto(String giftId, Boolean isOpened) {
    public static GiftResponseDto of(Gift gift, String encryptedGiftId) {
        return GiftResponseDto.builder()
                .giftId(encryptedGiftId)
                .isOpened(gift.getIsOpened())
                .build();
    }
}
