package chocolate.chocoletter.api.giftbox.dto.response;

public record VerifyIsSendResponseDto(boolean isSend) {
    public static VerifyIsSendResponseDto of(boolean isSend) {
        return new VerifyIsSendResponseDto(isSend);
    }
}
