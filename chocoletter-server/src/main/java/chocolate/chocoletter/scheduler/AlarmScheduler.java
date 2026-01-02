package chocolate.chocoletter.scheduler;

import chocolate.chocoletter.api.alarm.domain.Alarm;
import chocolate.chocoletter.api.alarm.domain.AlarmType;
import chocolate.chocoletter.api.alarm.repository.AlarmRepository;
import chocolate.chocoletter.api.gift.domain.Gift;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.repository.LetterRepository;
import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.service.MemberService;
import chocolate.chocoletter.api.unboxingRoom.domain.UnboxingRoom;
import chocolate.chocoletter.api.unboxingRoom.service.UnboxingRoomService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class AlarmScheduler {

    private final UnboxingRoomService unboxingRoomService;
    private final AlarmRepository alarmRepository;
    private final MemberService memberService;
    private final LetterRepository letterRepository;

    @Transactional
    @Scheduled(cron = "#{@alarmSchedulerProperties.getEventDayTransitionCron()}")
    public void scheduleUnboxingReminderDay() {
        scheduleUnboxingReminder();
    }

    private void scheduleUnboxingReminder() {
        unboxingRoomService.findUpcomingUnboxingRoomsIn30Minutes()
                .forEach(this::createAndSaveUnboxingAlarms);
    }

    private void createAndSaveUnboxingAlarms(UnboxingRoom unboxingRoom) {
        Member receiver = memberService.findMember(unboxingRoom.getReceiverId());
        Member sender = memberService.findMember(unboxingRoom.getSenderId());
        Gift gift = unboxingRoom.getGift();
        Letter letter = letterRepository.findLetterByGiftId(gift.getId());

        Alarm receiverAlarm = generateAlarm(letter.getNickname(), gift, receiver);
        Alarm senderAlarm = generateAlarm(receiver.getName(), gift, sender);

        alarmRepository.saveAll(List.of(receiverAlarm, senderAlarm));
    }

    private Alarm generateAlarm(String partnerName, Gift gift, Member targetMember) {
        return Alarm.builder()
                .type(AlarmType.UNBOXING_NOTICE)
                .partnerName(partnerName)
                .giftId(gift.getId())
                .member(targetMember)
                .build();
    }
}
