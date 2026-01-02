package chocolate.chocoletter.api.giftbox.dto.response;

import java.util.List;

public record MyUnBoxingTimesResponseDto(List<MyUnBoxingTimeResponseDto> myUnBoxingTimes) {
    public static MyUnBoxingTimesResponseDto of(List<MyUnBoxingTimeResponseDto> myUnBoxingTimes) {
        return new MyUnBoxingTimesResponseDto(myUnBoxingTimes);
    }
}
