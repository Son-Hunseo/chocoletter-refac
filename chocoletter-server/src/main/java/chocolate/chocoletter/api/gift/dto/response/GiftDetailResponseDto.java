package chocolate.chocoletter.api.gift.dto.response;

import chocolate.chocoletter.api.letter.domain.LetterType;
import chocolate.chocoletter.api.letter.dto.response.LetterDto;
import lombok.Builder;

@Builder
public record GiftDetailResponseDto (String giftId, LetterType type, String nickName, String content, String question, String answer){
    public static GiftDetailResponseDto of(String encryptGiftId, LetterDto letter) {
        return GiftDetailResponseDto.builder()
                .giftId(encryptGiftId)
                .type(letter.type())
                .nickName(letter.nickName())
                .content(letter.content())
                .question(letter.question())
                .answer(letter.answer())
                .build();
    }
}
