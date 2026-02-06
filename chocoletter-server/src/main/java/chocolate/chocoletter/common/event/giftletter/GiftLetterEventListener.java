package chocolate.chocoletter.common.event.giftletter;

import chocolate.chocoletter.api.giftletter.domain.GiftLetter;
import chocolate.chocoletter.api.giftletter.repository.GiftLetterRepository;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
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

    @EventListener
    public void handleChatRoomGiftQuery(ChatRoomGiftQuery query) {
        List<GiftLetter> gifts = giftLetterRepository.findAllById(
                List.of(query.getHostGiftId(), query.getGuestGiftId()));
        Map<Long, GiftLetter> giftMap = gifts.stream()
                .collect(Collectors.toMap(GiftLetter::getId, Function.identity()));

        GiftLetter hostGift = giftMap.get(query.getHostGiftId());
        GiftLetter guestGift = giftMap.get(query.getGuestGiftId());

        query.setResult(
                hostGift.getNickname(),
                guestGift.getNickname(),
                hostGift.getReceiverId(),
                guestGift.getReceiverId()
        );
    }

    @EventListener
    public void handleGiftLetterCountQuery(GiftLetterCountQuery query) {
        Long count = giftLetterRepository.countByGiftBoxId(query.getGiftBoxId());
        query.setResult(count);
    }

    @EventListener
    public void handleGiftLetterCountByMemberQuery(GiftLetterCountByMemberQuery query) {
        Long count = giftLetterRepository.countByReceiverId(query.getMemberId());
        query.setResult(count);
    }
}
