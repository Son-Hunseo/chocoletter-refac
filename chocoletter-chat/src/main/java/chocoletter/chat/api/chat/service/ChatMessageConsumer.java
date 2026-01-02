package chocoletter.chat.api.chat.service;

import chocoletter.chat.api.chat.domain.ChatMessage;
import chocoletter.chat.api.chat.domain.MessageType;
import chocoletter.chat.api.chat.dto.request.ChatMessageRequestDto;
import chocoletter.chat.api.chat.dto.response.ChatMessageResponseDto;
import chocoletter.chat.common.exception.ErrorMessage;
import chocoletter.chat.common.exception.InternalServerException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;

    @KafkaListener(topics = "${spring.kafka.topic.chat}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeMessage(String message) {
        // 메시지를 WebSocket으로 전송
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
            return;
        }

        // 현재 채팅방에 접속중인 인원이 있는지 확인
        boolean isAllConnected = chatRoomService.isAllConnected(chatMessageResponseDto.roomId());

        messagingTemplate.convertAndSend(topic, ChatMessageResponseDto.builder()
                .messageType(chatMessageResponseDto.messageType())
                .senderId(chatMessageResponseDto.senderId())
                .senderName(chatMessageResponseDto.senderName())
                .content(chatMessageResponseDto.content())
                .isRead(isAllConnected)
                .createdAt(String.valueOf(LocalDateTime.now()))
                .build());

        // MongoDB에 메시지 저장
        chatMessageService.saveChatMessage(ChatMessage.builder()
                .senderId(chatMessageResponseDto.senderId())
                .senderName(chatMessageResponseDto.senderName())
                .roomId(chatMessageResponseDto.roomId())
                .content(chatMessageResponseDto.content())
                .isRead(isAllConnected)
                .build());
    }

    private ChatMessageResponseDto parseMessage(String message) {
        // JSON 문자열을 DTO로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(message, ChatMessageResponseDto.class);
        } catch (JsonProcessingException e) {
            throw new InternalServerException(ErrorMessage.ERR_PARSING_MESSAGE);
        }
    }
}
