package chocolate.chocoletter.common.event.giftletter;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GiftLetterEventListener {
    private final GiftLetterRepository giftLetterRepository;

    @EventListener
    public void handleGiftLetterQuery(GiftLetterQuery query) {
        GiftLetter giftLetter = giftLetterRepository.findByIdOrThrow(query.getGiftLetterId());
        query.setResult(giftLetter.getNickname(), giftLetter.getReceiverId());
    }

    @EventListener
    public void handleGiftLetterEntityQuery(GiftLetterEntityQuery query) {
        GiftLetter giftLetter = giftLetterRepository.findByIdOrThrow(query.getGiftLetterId());
        query.setResult(giftLetter);
    }
}
