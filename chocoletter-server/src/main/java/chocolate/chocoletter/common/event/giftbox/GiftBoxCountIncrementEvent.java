package chocolate.chocoletter.common.event.giftbox;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class GiftBoxCountIncrementEvent {
    private final Long giftBoxId;
}
