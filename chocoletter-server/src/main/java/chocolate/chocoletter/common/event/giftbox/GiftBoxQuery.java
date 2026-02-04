package chocolate.chocoletter.common.event.giftbox;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GiftBoxQuery {
    private final Long giftBoxId;
    private GiftBox result;

    public void setResult(GiftBox giftBox) {
        this.result = giftBox;
    }

    public boolean hasResult() {
        return result != null;
    }
}
