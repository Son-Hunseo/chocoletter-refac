package chocolate.chocoletter.api.giftbox.dto.response;

import lombok.Builder;

@Builder
public record MyUnBoxingTimeResponseDto(String unBoxingTime, String nickName, String unboxingRoomId, Boolean isAccept) {
    public static MyUnBoxingTimeResponseDto of(String unBoxingTime, String nickName, String encryptedUnboxingRoomId,
                                               Boolean isAccept) {
        return MyUnBoxingTimeResponseDto.builder()
                .unboxingRoomId(encryptedUnboxingRoomId)
                .unBoxingTime(unBoxingTime)
                .nickName(nickName)
                .isAccept(isAccept)
                .build();
    }
}
