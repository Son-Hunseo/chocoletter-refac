package chocolate.chocoletter.common.event.giftletter;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GiftLetterQuery {
    private final Long giftLetterId;
    private String nickname;
    private Long receiverId;

    public void setResult(String nickname, Long receiverId) {
        this.nickname = nickname;
        this.receiverId = receiverId;
    }

    public boolean hasResult() {
        return nickname != null;
    }
}
