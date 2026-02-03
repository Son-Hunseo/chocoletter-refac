package chocolate.chocoletter.batch.job;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.LetterType;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaPagingItemReader;
import org.springframework.batch.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class GiftLetterMigrationJobConfig {
    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final EntityManagerFactory entityManagerFactory;
    private final GiftLetterRepository giftLetterRepository;

    @Bean
    public Job giftLetterMigrationJob() {
        return new JobBuilder("giftLetterMigrationJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(giftLetterMigrationStep())
                .build();
    }

    @Bean
    public Step giftLetterMigrationStep() {
        return new StepBuilder("giftLetterMigrationStep", jobRepository)
                .<Letter, GiftLetter>chunk(100, transactionManager)
                .reader(letterReader())
                .processor(letterToGiftLetterProcessor())
                .writer(giftLetterWriter())
                .faultTolerant()
                .skipLimit(10)
                .skip(Exception.class)
                .build();
    }

    @Bean
    public JpaPagingItemReader<Letter> letterReader() {
        return new JpaPagingItemReaderBuilder<Letter>()
                .name("letterReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT l FROM Letter l JOIN l.gift g JOIN g.giftBox gb ORDER BY l.id")
                .pageSize(100)
                .build();
    }

    @Bean
    public ItemProcessor<Letter, GiftLetter> letterToGiftLetterProcessor() {
        return letter -> {
            Long senderId = letter.getGift().getSenderId();
            Long giftBoxId = letter.getGift().getGiftBox().getId();

            // 이미 존재하면 스킵 (null 반환 시 해당 아이템 제외)
            if (giftLetterRepository.findBySenderIdAndGiftBoxId(senderId, giftBoxId).isPresent()) {
                log.info("Skipping Letter id: {} (already migrated)", letter.getId());
                return null;
            }

            log.info("Processing Letter id: {}", letter.getId());

            if (letter.getType() == LetterType.FREE) {
                return GiftLetter.createGeneralGiftLetter(
                        letter.getGift().getGiftBox(),
                        senderId,
                        letter.getGift().getReceiverId(),
                        letter.getNickname(),
                        letter.getContent()
                );
            } else {
                return GiftLetter.createQuestionGiftLetter(
                        letter.getGift().getGiftBox(),
                        senderId,
                        letter.getGift().getReceiverId(),
                        letter.getNickname(),
                        letter.getQuestion(),
                        letter.getAnswer()
                );
            }
        };
    }

    @Bean
    public ItemWriter<GiftLetter> giftLetterWriter() {
        return giftLetters -> {
            log.info("Writing {} GiftLetters", giftLetters.size());
            giftLetterRepository.saveAll(giftLetters);
        };
    }
}
