package chocolate.chocoletter.common.event.giftbox;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GiftBoxCountQuery {
    private final Long memberId;
    private Integer giftCount;

    public void setResult(Integer giftCount) {
        this.giftCount = giftCount;
    }

    public boolean hasResult() {
        return giftCount != null;
    }
}
