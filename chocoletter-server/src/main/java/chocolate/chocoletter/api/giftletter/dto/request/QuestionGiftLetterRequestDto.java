package chocolate.chocoletter.api.giftletter.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record QuestionGiftLetterRequestDto(
        @NotNull
        @Size(min = 1, max = 25)
        String nickName,
        @NotNull
        String question,
        @NotNull
        String answer) {
}
