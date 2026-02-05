package chocolate.chocoletter.common.event.giftletter;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ChatRoomGiftQuery {
    private final Long hostGiftId;
    private final Long guestGiftId;

    private String hostSenderNickname;
    private String guestSenderNickname;
    private Long hostReceiverId;
    private Long guestReceiverId;

    public void setResult(String hostSenderNickname, String guestSenderNickname,
                          Long hostReceiverId, Long guestReceiverId) {
        this.hostSenderNickname = hostSenderNickname;
        this.guestSenderNickname = guestSenderNickname;
        this.hostReceiverId = hostReceiverId;
        this.guestReceiverId = guestReceiverId;
    }

    public boolean hasResult() {
        return hostSenderNickname != null && guestSenderNickname != null;
    }
}
