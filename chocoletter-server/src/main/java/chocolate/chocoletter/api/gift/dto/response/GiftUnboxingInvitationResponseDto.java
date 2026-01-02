package chocolate.chocoletter.api.gift.dto.response;

public record GiftUnboxingInvitationResponseDto(String unboxingTime) {
    public static GiftUnboxingInvitationResponseDto of(String unboxingTime) {
        return new GiftUnboxingInvitationResponseDto(unboxingTime);
    }
}
