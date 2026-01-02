package chocolate.chocoletter.api.giftbox.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GiftBoxTypeRequestDto(
        @NotNull
        @Min(1)
        @Max(5)
        Integer type) {
}