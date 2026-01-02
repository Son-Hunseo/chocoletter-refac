package chocolate.chocoletter.api.giftbox.dto.response;

import java.util.List;

public record UnboxingTimesResponseDto(List<String> unboxingTimes) {
    public static UnboxingTimesResponseDto of(List<String> unboxingTime) {
        return new UnboxingTimesResponseDto(unboxingTime);
    }
}
