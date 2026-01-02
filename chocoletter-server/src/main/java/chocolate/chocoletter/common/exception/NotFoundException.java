package chocolate.chocoletter.common.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends ChocoLetterException {
    public NotFoundException(ErrorMessage errorMessage) {
        super(HttpStatus.NOT_FOUND, errorMessage);
    }
}
