package chocolate.chocoletter.api.giftbox.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record GeneralFreeGiftRequestDto(
        @NotNull
        @Size(min = 1, max = 25)
        String nickName,
        @NotNull
        String content) {

}
