package chocolate.chocoletter.api.chatroom.dto.response;

import chocolate.chocoletter.api.letter.domain.LetterType;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import lombok.Builder;

@Builder
public record ChatLetterResponseDto(LetterType type, String nickName, String content, String question, String answer) {
    public static ChatLetterResponseDto of(LetterDto letter) {
        return ChatLetterResponseDto.builder()
                .type(letter.type())
                .nickName(letter.nickName())
                .content(letter.content())
                .question(letter.question())
                .answer(letter.answer())
                .build();
    }
}
