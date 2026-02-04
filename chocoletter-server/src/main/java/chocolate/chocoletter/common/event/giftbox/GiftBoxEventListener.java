package chocolate.chocoletter.common.event.giftbox;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.giftbox.repository.GiftBoxRepository;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GiftBoxEventListener {
    private final GiftBoxRepository giftBoxRepository;

    @EventListener
    public void handleGiftBoxCountQuery(GiftBoxCountQuery query) {
        giftBoxRepository.findByMemberId(query.getMemberId())
                .ifPresent(giftBox -> query.setResult(giftBox.getGiftCount()));
    }

    @EventListener
    public void handleGiftBoxQuery(GiftBoxQuery query) {
        GiftBox giftBox = giftBoxRepository.findGiftBoxByGiftBoxId(query.getGiftBoxId());
        if (giftBox != null) {
            query.setResult(giftBox);
        }
    }

    @EventListener
    public void handleGiftBoxCountIncrementEvent(GiftBoxCountIncrementEvent event) {
        GiftBox giftBox = giftBoxRepository.findById(event.getGiftBoxId())
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_GIFT_BOX));
        giftBox.addGiftCount();
    }
}
