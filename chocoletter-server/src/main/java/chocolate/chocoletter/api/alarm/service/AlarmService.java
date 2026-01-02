package chocolate.chocoletter.api.alarm.service;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.domain.AlarmType;
import chocolate.chocoletter.api.alarm.dto.response.AlarmResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.AlarmsResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.NewAlarmResponseDto;
import chocolate.chocoletter.api.alarm.repository.AlarmRepository;
import chocolate.chocoletter.api.gift.repository.GiftRepository;
import chocolate.chocoletter.common.util.IdEncryptionUtil;
import jakarta.transaction.Transactional;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmService {
    private final AlarmRepository alarmRepository;
    private final GiftRepository giftRepository;
    private final IdEncryptionUtil idEncryptionUtil;

    @Transactional
    public AlarmsResponseDto findMyAlarms(Long memberId) {
        List<Alarm> alarms = Optional.ofNullable(alarmRepository.findByAlarms(memberId))
                .orElse(Collections.emptyList());

        List<Long> giftIds = alarms.stream()
                .map(Alarm::getGiftId)
                .filter(Objects::nonNull) // null 값 제거
                .distinct()
                .toList();

        Map<Long, String> unboxingTimeMap = findUnBoxingTimes(giftIds);

        List<AlarmResponseDto> myAlarms = alarms.stream()
                .map(alarm -> AlarmResponseDto.of(
                        alarm,
                        unboxingTimeMap.getOrDefault(alarm.getGiftId(), null),
                        idEncryptionUtil.encrypt(alarm.getGiftId())
                ))
                .toList();

        alarms.forEach(Alarm::readAlarm);

        return AlarmsResponseDto.of(myAlarms);
    }

    @Transactional
    public void save(Alarm alarm) {
        alarmRepository.save(alarm);
    }

    @Transactional
    public void delete(Long alarmId) {
        alarmRepository.deleteById(alarmId);
    }

    public List<Alarm> findMyAlarmsByAlarmType(Long memberId, Long giftId, AlarmType alarmType) {
        return alarmRepository.findAlarmsByType(memberId, giftId, alarmType);
    }

    public NewAlarmResponseDto findNewAlarms(Long memberId) {
        return NewAlarmResponseDto.of(alarmRepository.countNewAlarm(memberId, false));
    }

    private Map<Long, String> findUnBoxingTimes(List<Long> giftIds) {
        if (giftIds == null || giftIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<Object[]> results = Optional.ofNullable(giftRepository.findUnBoxingTimesByGiftIds(giftIds))
                .orElse(Collections.emptyList());

        return results.stream()
                .filter(row -> row != null && row.length >= 2 && row[0] != null) // null 값 필터링
                .collect(Collectors.toMap(
                        row -> (Long) row[0],  // giftId (null 방지)
                        row -> row[1] != null ? row[1].toString() : "" // null이면 빈 문자열 반환
                ));
    }
}
