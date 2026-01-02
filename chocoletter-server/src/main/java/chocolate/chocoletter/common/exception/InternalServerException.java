package chocolate.chocoletter.common.exception;

import org.springframework.http.HttpStatus;

public class InternalServerException extends ChocoLetterException {
    public InternalServerException(ErrorMessage errorMessage) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    }
}
