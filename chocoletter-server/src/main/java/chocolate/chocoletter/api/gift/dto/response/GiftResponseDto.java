package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import lombok.Builder;

@Builder
public record GiftResponseDto(String giftId, GiftType giftType, Boolean isOpened) {
    public static GiftResponseDto of(Gift gift, String encryptedGiftId) {
        return GiftResponseDto.builder()
                .giftId(encryptedGiftId)
                .giftType(gift.getType())
                .isOpened(gift.getIsOpened())
                .build();
    }
}
