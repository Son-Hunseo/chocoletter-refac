package chocoletter.chat.api.chat.service;

import chocoletter.chat.common.config.RedisConfig;
import chocoletter.chat.common.exception.ErrorMessage;
import chocoletter.chat.common.exception.InternalServerException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageProducer {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public <T> void sendMessage(String roomId, T messageDto) {
        try {
            String message = objectMapper.writeValueAsString(messageDto);
            String streamKey = RedisConfig.getStreamKey(roomId);

            ObjectRecord<String, String> record = StreamRecords.newRecord()
                    .ofObject(message)
                    .withStreamKey(streamKey);

            stringRedisTemplate.opsForStream().add(record);
        } catch (JsonProcessingException e) {
            throw new InternalServerException(ErrorMessage.ERR_SERIALIZE_MESSAGE);
        }
    }
}
