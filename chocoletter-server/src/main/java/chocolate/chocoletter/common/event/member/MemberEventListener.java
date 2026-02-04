package chocolate.chocoletter.common.event.member;

import chocolate.chocoletter.api.member.domain.Member;
import chocolate.chocoletter.api.member.repository.MemberRepository;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MemberEventListener {
    private final MemberRepository memberRepository;

    @EventListener
    public void handleMemberSendCountIncrementEvent(MemberSendCountIncrementEvent event) {
        Member member = memberRepository.findById(event.getMemberId())
                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_USER));
        member.increaseSendGiftCount();
    }
}
