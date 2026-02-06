package chocolate.chocoletter.api.member.service;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.dto.response.MyPageResponseDto;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.event.giftletter.GiftLetterCountByMemberQuery;
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
        GiftLetterCountByMemberQuery query = new GiftLetterCountByMemberQuery(memberId);
        eventPublisher.publishEvent(query);
        Long giftCount = query.getCount() != null ? query.getCount() : 0L;

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_USER));
        return MyPageResponseDto.of(giftCount.intValue(), member);
    }
}
