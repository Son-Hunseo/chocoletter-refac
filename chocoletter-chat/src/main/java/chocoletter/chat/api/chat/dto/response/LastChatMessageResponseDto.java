package chocoletter.chat.api.chat.dto.response;

import lombok.Builder;

@Builder
public record LastChatMessageResponseDto(Integer count, String message) {
    public static LastChatMessageResponseDto of(Integer count, String message) {
        return LastChatMessageResponseDto.builder()
                .count(count)
                .message(message)
                .build();
    }
}
