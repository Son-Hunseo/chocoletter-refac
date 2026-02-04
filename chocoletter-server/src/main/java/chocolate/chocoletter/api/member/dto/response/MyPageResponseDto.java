package chocolate.chocoletter.api.member.dto.response;

import chocolate.chocoletter.api.member.domain.Member;
import lombok.Builder;

@Builder
public record MyPageResponseDto(int receivedGiftCount, int sendGiftCount) {
    public static MyPageResponseDto of(Integer giftCount, Member member) {
        return MyPageResponseDto.builder()
                .receivedGiftCount(giftCount != null ? giftCount : 0)
                .sendGiftCount(member.getSendGiftCount())
                .build();
    }
}
