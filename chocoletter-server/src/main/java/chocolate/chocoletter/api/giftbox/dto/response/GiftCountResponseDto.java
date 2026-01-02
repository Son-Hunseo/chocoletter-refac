package chocolate.chocoletter.api.giftbox.dto.response;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import lombok.Builder;

@Builder
public record GiftCountResponseDto(Integer giftCount, Integer canOpenGiftCount) {
    public static GiftCountResponseDto of(GiftBox giftBox) {
        return GiftCountResponseDto.builder()
                .giftCount(giftBox.getGiftCount())
                .canOpenGiftCount((giftBox.getGeneralGiftCount() / 2))
                .build();
    }
}
