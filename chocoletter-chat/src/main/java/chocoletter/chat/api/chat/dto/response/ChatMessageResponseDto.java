package chocoletter.chat.api.chat.dto.response;


import chocoletter.chat.api.chat.domain.ChatMessage;
import chocoletter.chat.api.chat.domain.MessageType;
import lombok.Builder;

@Builder
public record ChatMessageResponseDto(MessageType messageType, String roomId, String senderId, String senderName,
                                     String content, String createdAt, Boolean isRead) {
    public static ChatMessageResponseDto of(MessageType messageType, ChatMessage chatMessage) {
        return ChatMessageResponseDto.builder()
                .messageType(messageType)
                .roomId(chatMessage.getRoomId())
                .senderId(chatMessage.getSenderId())
                .senderName(chatMessage.getSenderName())
                .content(chatMessage.getContent())
                .createdAt(chatMessage.getCreatedAt().toString())
                .isRead(chatMessage.getIsRead())
                .build();
    }
}
