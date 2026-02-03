package chocolate.chocoletter.batch.controller;

import java.security.Principal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/batch")
@RequiredArgsConstructor
public class BatchController {
    private static final Long ADMIN_MEMBER_ID = 24L; // 관리자 ID

    private final JobLauncher jobLauncher;
    private final Job giftLetterMigrationJob;

    @PostMapping("/gift-letter-migration")
    public ResponseEntity<String> runGiftLetterMigration(Principal principal) {
        Long memberId = Long.parseLong(principal.getName());
        if (!ADMIN_MEMBER_ID.equals(memberId)) {
            log.warn("Unauthorized batch access attempt by memberId: {}", memberId);
            return ResponseEntity.status(403).body("Forbidden");
        }

        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("run.id", System.currentTimeMillis())
                    .toJobParameters();

            jobLauncher.run(giftLetterMigrationJob, jobParameters);

            log.info("GiftLetter migration job started successfully by memberId: {}", memberId);
            return ResponseEntity.ok("Migration job started successfully");
        } catch (Exception e) {
            log.error("Failed to start migration job", e);
            return ResponseEntity.internalServerError()
                    .body("Failed to start migration job: " + e.getMessage());
        }
    }
}
