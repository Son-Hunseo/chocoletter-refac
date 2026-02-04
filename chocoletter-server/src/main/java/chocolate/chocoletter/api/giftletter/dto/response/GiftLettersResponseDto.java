package chocolate.chocoletter.api.giftletter.dto.response;

import java.util.List;

public record GiftLettersResponseDto(List<GiftLetterResponseDto> giftLetters) {
    public static GiftLettersResponseDto of(List<GiftLetterResponseDto> giftLetters) {
        return new GiftLettersResponseDto(giftLetters);
    }
}
