package chocolate.chocoletter.api.unboxingRoom.dto.response;

import chocolate.chocoletter.api.gift.dto.response.GiftDetailResponseDto;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record HasAccessUnboxingRoomResponseDto(
        LocalDateTime unboxingTime,
        GiftDetailResponseDto giftDetail) {
    public static HasAccessUnboxingRoomResponseDto of(LocalDateTime unboxingTime, GiftDetailResponseDto giftDetail) {
        return HasAccessUnboxingRoomResponseDto.builder()
                .unboxingTime(unboxingTime)
                .giftDetail(giftDetail)
                .build();
    }
}
