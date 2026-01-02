package chocolate.chocoletter.api.alarm.dto.response;

public record NewAlarmResponseDto(Integer count) {
    public static NewAlarmResponseDto of(Integer count) {
        return new NewAlarmResponseDto(count);
    }
}
