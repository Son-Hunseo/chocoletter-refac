package chocolate.chocoletter.api.chatroom.dto.response;

import java.util.List;

public record ChatRoomsResponseDto(List<ChatRoomResponseDto> chatRooms) {
    public static ChatRoomsResponseDto of(List<ChatRoomResponseDto> chatRooms) {
        return new ChatRoomsResponseDto(chatRooms);
    }
}
