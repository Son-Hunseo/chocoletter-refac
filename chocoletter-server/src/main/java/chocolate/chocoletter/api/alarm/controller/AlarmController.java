package chocolate.chocoletter.api.alarm.controller;

import chocolate.chocoletter.api.alarm.dto.response.AlarmsResponseDto;
import chocolate.chocoletter.api.alarm.dto.response.NewAlarmResponseDto;
import chocolate.chocoletter.api.alarm.service.AlarmService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alarm")
@RequiredArgsConstructor
public class AlarmController implements AlarmSwagger {
    private final AlarmService alarmService;

    @GetMapping("/all")
    public ResponseEntity<?> findMyAlarms(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        AlarmsResponseDto myAlarms = alarmService.findMyAlarms(memberId);
        return ResponseEntity.ok(myAlarms);
    }

    @GetMapping("/count")
    public ResponseEntity<?> countMyAlarms(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        NewAlarmResponseDto newAlarms = alarmService.findNewAlarms(memberId);
        return ResponseEntity.ok(newAlarms);
    }
}
