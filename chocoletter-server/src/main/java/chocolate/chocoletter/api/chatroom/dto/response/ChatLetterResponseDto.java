package chocolate.chocoletter.api.chatroom.dto.response;

import chocolate.chocoletter.api.giftletter.domain.LetterType;
import chocolate.chocoletter.api.giftletter.dto.response.GiftLetterDetailResponseDto;
import lombok.Builder;

@Builder
public record ChatLetterResponseDto(LetterType type, String nickName, String content, String question, String answer) {
    public static ChatLetterResponseDto of(GiftLetterDetailResponseDto giftLetter) {
        return ChatLetterResponseDto.builder()
                .type(giftLetter.type())
                .nickName(giftLetter.nickName())
                .content(giftLetter.content())
                .question(giftLetter.question())
                .answer(giftLetter.answer())
                .build();
    }
}
