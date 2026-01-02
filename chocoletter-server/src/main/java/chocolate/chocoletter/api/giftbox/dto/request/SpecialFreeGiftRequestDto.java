package chocolate.chocoletter.api.giftbox.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SpecialFreeGiftRequestDto(
        @NotNull
        @Size(min = 1, max = 25)
        String nickName,
        @NotNull
        String content,
        @Pattern(
                regexp = "^([01]\\d|2[0-3]):(00|10|20|30|40|50)$",
                message = "unBoxingTime은 HH:mm 형식이어야 하며, 분은 10분 단위로 설정해야 합니다. (예: 18:00, 18:10)"
        )
        String unBoxingTime) {
}
