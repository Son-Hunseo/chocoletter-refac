package chocoletter.chat.common.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ChocoLetterException {
    public BadRequestException(ErrorMessage errorMessage) {
        super(HttpStatus.BAD_REQUEST, errorMessage);
    }
}
