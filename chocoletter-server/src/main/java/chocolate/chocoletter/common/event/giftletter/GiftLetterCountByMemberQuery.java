package chocolate.chocoletter.common.event.giftletter;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GiftLetterCountByMemberQuery {
    private final Long memberId;
    private Long count;

    public void setResult(Long count) {
        this.count = count;
    }

    public boolean hasResult() {
        return count != null;
    }
}
