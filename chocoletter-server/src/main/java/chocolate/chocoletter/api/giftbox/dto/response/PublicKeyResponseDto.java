package chocolate.chocoletter.api.giftbox.dto.response;

public record PublicKeyResponseDto(String publicKey) {
    public static PublicKeyResponseDto of(String publicKey) {
        return new PublicKeyResponseDto(publicKey);
    }
}
