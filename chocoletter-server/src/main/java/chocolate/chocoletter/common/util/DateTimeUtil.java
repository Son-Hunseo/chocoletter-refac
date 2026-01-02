package chocolate.chocoletter.common.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DateTimeUtil {

    @Value("${special-gift.open-day}")
    private String openDay;

    public LocalDateTime parseTimeToDateTime(String time) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime parsedTime = LocalTime.parse(time, timeFormatter);
        log.warn("parseTimeToDateTime: {}", LocalDateTime.of(getOpenDay(), parsedTime));
        return LocalDateTime.of(getOpenDay(), parsedTime);
    }

    public String formatDateTime(LocalDateTime dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return dateTime.format(formatter);
    }

    public LocalDate getOpenDay() {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy.MM.dd");
        return LocalDate.parse(openDay, dateFormatter);
    }
}