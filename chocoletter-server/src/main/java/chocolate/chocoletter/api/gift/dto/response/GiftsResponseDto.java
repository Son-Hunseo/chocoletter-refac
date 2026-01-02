package chocolate.chocoletter.api.gift.dto.response;

import java.util.List;

public record GiftsResponseDto(List<GiftResponseDto> gifts) {
	public static GiftsResponseDto of(List<GiftResponseDto> gifts) {
		return new GiftsResponseDto(gifts);
	}
}
