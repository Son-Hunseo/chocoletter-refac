package chocolate.chocoletter.common.event.member;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MemberSendCountIncrementEvent {
    private final Long memberId;
}
