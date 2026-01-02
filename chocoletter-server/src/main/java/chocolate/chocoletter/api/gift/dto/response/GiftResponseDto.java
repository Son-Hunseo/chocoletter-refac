package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.gift.domain.GiftType;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record GiftResponseDto(String giftId, GiftType giftType, Boolean isOpened, LocalDateTime unBoxingTime,
                              String unBoxingRoomId, Boolean isAccept) {
    public static GiftResponseDto of(Gift gift, String encryptedGiftId, String encryptedUnboxingRoomId) {
        return GiftResponseDto.builder()
                .giftId(encryptedGiftId)
                .giftType(gift.getType())
                .isOpened(gift.getIsOpened())
                .unBoxingTime(gift.getUnBoxingTime())
                .unBoxingRoomId(encryptedUnboxingRoomId)
                .isAccept(gift.getIsAccept())
                .build();
    }
}
