package chocolate.chocoletter.api.member.dto.response;

import chocolate.chocoletter.api.giftbox.domain.GiftBox;
import chocolate.chocoletter.api.member.domain.Member;
import lombok.Builder;

@Builder
public record MyPageResponseDto(int receivedGiftCount, int sendGiftCount) {
    public static MyPageResponseDto of(GiftBox giftBox, Member member) {
        return MyPageResponseDto.builder()
                .receivedGiftCount(giftBox.getGiftCount())
                .sendGiftCount(member.getSendGiftCount())
                .build();
    }
}
