package chocolate.chocoletter.api.alarm.dto.response;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.domain.AlarmType;
import lombok.Builder;

@Builder
public record AlarmResponseDto(Long alarmId, AlarmType alarmType, String partnerName, String unBoxingTime,
                               String giftId, Boolean read) {
    public static AlarmResponseDto of(Alarm alarm, String unBoxingTime, String giftId) {
        return AlarmResponseDto.builder()
                .alarmId(alarm.getId())
                .alarmType(alarm.getType())
                .partnerName(alarm.getPartnerName())
                .unBoxingTime(unBoxingTime)
                .giftId(giftId)
                .read(alarm.getIsRead())
                .build();
    }
}
