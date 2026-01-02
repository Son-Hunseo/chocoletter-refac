package chocoletter.chat.common.config;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    private final String[] acks = {"0", "1", "all"}; // ACK 설정 옵션

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(kafkaProducerFactory());
    }

    private ProducerFactory<String, String> kafkaProducerFactory() {
        Map<String, Object> props = new HashMap<>();

        // Kafka 클러스터 주소 설정
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

        // Serializer 설정
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);

        // ACK 설정
        // acks[1]: 브로커 한 대만 확인하면 성공으로 처리
        // acks[2]: all은 리더와 복제본 모두가 확인할 때 성공으로 처리
        props.put(ProducerConfig.ACKS_CONFIG, acks[1]);

        // 추가 옵션
        props.put(ProducerConfig.LINGER_MS_CONFIG, 5); // 메시지 배치 딜레이 (밀리초)
        props.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384); // 배치 크기 (16KB)

        return new DefaultKafkaProducerFactory<>(props);
    }
}

