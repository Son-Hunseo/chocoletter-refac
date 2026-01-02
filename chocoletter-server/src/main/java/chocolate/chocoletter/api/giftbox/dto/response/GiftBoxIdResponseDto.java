package chocolate.chocoletter.api.giftbox.dto.response;

import lombok.Builder;

@Builder
public record GiftBoxIdResponseDto(String giftBoxId) {
    public static GiftBoxIdResponseDto of(String encryptedGiftBoxId) {
        return GiftBoxIdResponseDto.builder()
                .giftBoxId(encryptedGiftBoxId)
                .build();
    }
}
