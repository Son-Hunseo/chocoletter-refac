package chocoletter.chat.api.chat.service;

import chocoletter.chat.api.chat.domain.ChatMessage;
import chocoletter.chat.api.chat.domain.MessageType;
import chocoletter.chat.api.chat.dto.response.ChatMessageResponseDto;
import chocoletter.chat.common.exception.ErrorMessage;
import chocoletter.chat.common.exception.InternalServerException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageSubscriber {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final ChatRoomService chatRoomService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void onMessage(String message, String pattern) {
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

    private ChatMessageResponseDto parseMessage(String message) {
        try {
            return objectMapper.readValue(message, ChatMessageResponseDto.class);
        } catch (JsonProcessingException e) {
            throw new InternalServerException(ErrorMessage.ERR_PARSING_MESSAGE);
        }
    }
}
