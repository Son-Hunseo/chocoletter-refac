package chocoletter.chat.api.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageProducer {

    private final StringRedisTemplate stringRedisTemplate;

    public void sendMessage(String roomId, String message) {
        stringRedisTemplate.convertAndSend("chat:" + roomId, message);
    }
}
