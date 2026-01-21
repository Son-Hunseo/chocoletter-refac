package chocoletter.chat.common.config;

import chocoletter.chat.api.chat.service.ChatMessageSubscriber;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;

@Configuration
public class RedisConfig {

    public static final String STREAM_KEY_PREFIX = "chat-stream:";
    public static final String CONSUMER_GROUP = "chat-group";
    public static final int PARTITION_COUNT = 8;

    public static String getStreamKey(String roomId) {
        int partition = Math.abs(roomId.hashCode() % PARTITION_COUNT);
        return STREAM_KEY_PREFIX + partition;
    }

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        return new LettuceConnectionFactory(config);
    }

    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    public StreamMessageListenerContainer<String, ObjectRecord<String, String>> streamMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            ChatMessageSubscriber subscriber,
            StringRedisTemplate stringRedisTemplate) {

        createConsumerGroupsForAllPartitions(stringRedisTemplate);

        StreamMessageListenerContainer.StreamMessageListenerContainerOptions<String, ObjectRecord<String, String>> options =
                StreamMessageListenerContainer.StreamMessageListenerContainerOptions.builder()
                        .pollTimeout(Duration.ofSeconds(1))
                        .targetType(String.class)
                        .build();

        StreamMessageListenerContainer<String, ObjectRecord<String, String>> container =
                StreamMessageListenerContainer.create(connectionFactory, options);

        String consumerName = getConsumerName();
        for (int i = 0; i < PARTITION_COUNT; i++) {
            String streamKey = STREAM_KEY_PREFIX + i;
            container.receive(
                    Consumer.from(CONSUMER_GROUP, consumerName),
                    StreamOffset.create(streamKey, ReadOffset.lastConsumed()),
                    subscriber
            );
        }

        container.start();
        return container;
    }

    private void createConsumerGroupsForAllPartitions(StringRedisTemplate redisTemplate) {
        for (int i = 0; i < PARTITION_COUNT; i++) {
            String streamKey = STREAM_KEY_PREFIX + i;
            try {
                redisTemplate.opsForStream().createGroup(streamKey, ReadOffset.from("0"), CONSUMER_GROUP);
            } catch (Exception e) {
                // Consumer Group이 이미 존재하거나 Stream이 없는 경우 무시
            }
        }
    }

    private String getConsumerName() {
        try {
            return InetAddress.getLocalHost().getHostName() + "-" + UUID.randomUUID().toString().substring(0, 8);
        } catch (UnknownHostException e) {
            return "consumer-" + UUID.randomUUID().toString().substring(0, 8);
        }
    }
}
