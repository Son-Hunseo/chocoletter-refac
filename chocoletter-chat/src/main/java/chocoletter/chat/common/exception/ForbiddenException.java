package chocoletter.chat.common.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ChocoLetterException {
    public ForbiddenException(ErrorMessage errorMessage) {
        super(HttpStatus.FORBIDDEN, errorMessage);
    }
}
