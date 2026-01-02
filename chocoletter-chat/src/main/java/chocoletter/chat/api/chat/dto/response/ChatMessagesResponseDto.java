package chocoletter.chat.api.chat.dto.response;

import java.util.List;

public record ChatMessagesResponseDto(List<ChatMessageResponseDto> chatMessages) {
    public static ChatMessagesResponseDto of(List<ChatMessageResponseDto> chatMessages) {
        return new ChatMessagesResponseDto(chatMessages);
    }
}
