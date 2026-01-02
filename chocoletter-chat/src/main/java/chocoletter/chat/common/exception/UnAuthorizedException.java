package chocoletter.chat.common.exception;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends ChocoLetterException {
    public UnAuthorizedException(ErrorMessage errorMessage) {
        super(HttpStatus.UNAUTHORIZED, errorMessage);
    }
}
