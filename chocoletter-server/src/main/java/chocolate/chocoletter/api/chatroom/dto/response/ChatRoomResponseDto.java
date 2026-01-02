package chocolate.chocoletter.api.chatroom.dto.response;

public record ChatRoomResponseDto(String roomId, String nickName) {
    public static ChatRoomResponseDto of(String roomId, String nickName) {
        return new ChatRoomResponseDto(roomId, nickName);
    }
}
