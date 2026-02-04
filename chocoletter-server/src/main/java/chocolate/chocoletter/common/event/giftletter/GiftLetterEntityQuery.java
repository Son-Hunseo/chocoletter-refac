package chocolate.chocoletter.common.event.giftletter;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GiftLetterEntityQuery {
    private final Long giftLetterId;
    private GiftLetter result;

    public void setResult(GiftLetter giftLetter) {
        this.result = giftLetter;
    }

    public boolean hasResult() {
        return result != null;
    }
}
