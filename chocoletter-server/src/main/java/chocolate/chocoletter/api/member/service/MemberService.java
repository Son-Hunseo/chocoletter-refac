package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.dto.response.MyPageResponseDto;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.event.giftbox.GiftBoxCountQuery;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final ApplicationEventPublisher eventPublisher;

    public MyPageResponseDto findMypage(Long memberId) {
        GiftBoxCountQuery query = new GiftBoxCountQuery(memberId);
        eventPublisher.publishEvent(query);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_USER));
        return MyPageResponseDto.of(query.getGiftCount(), member);
    }
}
