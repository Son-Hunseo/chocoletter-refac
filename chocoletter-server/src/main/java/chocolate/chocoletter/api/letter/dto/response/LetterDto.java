package chocolate.chocoletter.api.letter.dto.response;

import chocolate.chocoletter.api.gift.dto.response.GiftResponseDto;
import chocolate.chocoletter.api.letter.domain.Letter;
import chocolate.chocoletter.api.letter.domain.LetterType;
import lombok.Builder;

@Builder
public record LetterDto(LetterType type, String nickName, String content, String question, String answer) {
    public static LetterDto of(Letter letter) {
        return LetterDto.builder()
                .type(letter.getType())
                .nickName(letter.getNickname())
                .content(letter.getContent())
                .question(letter.getQuestion())
                .answer(letter.getAnswer())
                .build();
    }
}
