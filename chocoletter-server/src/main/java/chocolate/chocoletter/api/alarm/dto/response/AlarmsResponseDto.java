package chocolate.chocoletter.api.alarm.dto.response;

import java.util.List;

public record AlarmsResponseDto(List<AlarmResponseDto> alarms) {
    public static AlarmsResponseDto of(List<AlarmResponseDto> alarms) {
        return new AlarmsResponseDto(alarms);
    }
}
