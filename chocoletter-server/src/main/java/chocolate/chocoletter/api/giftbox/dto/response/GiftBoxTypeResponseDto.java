package chocolate.chocoletter.api.giftbox.dto.response;

public record GiftBoxTypeResponseDto(int type) {
    public static GiftBoxTypeResponseDto of(int type) {
        return new GiftBoxTypeResponseDto(type);
    }
}
