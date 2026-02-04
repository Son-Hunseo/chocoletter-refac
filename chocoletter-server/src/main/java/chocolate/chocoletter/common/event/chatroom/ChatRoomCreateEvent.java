package chocolate.chocoletter.common.event.chatroom;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ChatRoomCreateEvent {
    private final Long hostId;
    private final Long guestId;
    private final Long hostGiftId;
    private final Long guestGiftId;
}
