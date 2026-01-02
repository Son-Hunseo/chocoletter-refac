package chocoletter.chat.api.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String roomId, String message) {
        kafkaTemplate.send("chat", roomId, message); // Key로 roomId 설정
    }
}
