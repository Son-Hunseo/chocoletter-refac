package chocolate.chocoletter.scheduler;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "scheduler")
public class AlarmSchedulerProperties {
    private String eventDayTransitionCron;
}
