package chocoletter.chat.api.chat.service;

import chocoletter.chat.api.chat.domain.ChatMessage;
import chocoletter.chat.api.chat.domain.MessageType;
import chocoletter.chat.api.chat.dto.response.ChatMessageResponseDto;
import chocoletter.chat.common.config.RedisConfig;
import chocoletter.chat.common.exception.ErrorMessage;
import chocoletter.chat.common.exception.InternalServerException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.ObjectRecord;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.stream.StreamListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageSubscriber implements StreamListener<String, ObjectRecord<String, String>> {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(ObjectRecord<String, String> record) {
        try {
            String message = record.getValue();
            ChatMessageResponseDto chatMessageResponseDto = parseMessage(message);
            String topic = "/topic/" + chatMessageResponseDto.roomId();

            if (chatMessageResponseDto.messageType().equals(MessageType.READ_STATUS)) {
                ChatMessageResponseDto result = ChatMessageResponseDto.builder()
                        .messageType(chatMessageResponseDto.messageType())
                        .senderId(chatMessageResponseDto.senderId())
                        .senderName(chatMessageResponseDto.senderName())
                        .content(chatMessageResponseDto.content())
                        .isRead(false)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .build();
                messagingTemplate.convertAndSend(topic, result);
            } else {
                boolean isAllConnected = chatRoomService.isAllConnected(chatMessageResponseDto.roomId());

                messagingTemplate.convertAndSend(topic, ChatMessageResponseDto.builder()
                        .messageType(chatMessageResponseDto.messageType())
                        .senderId(chatMessageResponseDto.senderId())
                        .senderName(chatMessageResponseDto.senderName())
                        .content(chatMessageResponseDto.content())
                        .isRead(isAllConnected)
                        .createdAt(String.valueOf(LocalDateTime.now()))
                        .build());

                chatMessageService.saveChatMessage(ChatMessage.builder()
                        .senderId(chatMessageResponseDto.senderId())
                        .senderName(chatMessageResponseDto.senderName())
                        .roomId(chatMessageResponseDto.roomId())
                        .content(chatMessageResponseDto.content())
                        .isRead(isAllConnected)
                        .build());
            }

            // 메시지 처리 완료 후 ACK 및 삭제
            String streamKey = record.getStream();
            stringRedisTemplate.opsForStream().acknowledge(streamKey, RedisConfig.CONSUMER_GROUP, record.getId());
            stringRedisTemplate.opsForStream().delete(streamKey, record.getId());
        } catch (Exception e) {
            log.error("Failed to process message: {}", record.getId(), e);
        }
    }

    private ChatMessageResponseDto parseMessage(String message) {
        try {
            return objectMapper.readValue(message, ChatMessageResponseDto.class);
        } catch (JsonProcessingException e) {
            throw new InternalServerException(ErrorMessage.ERR_PARSING_MESSAGE);
        }
    }
}
