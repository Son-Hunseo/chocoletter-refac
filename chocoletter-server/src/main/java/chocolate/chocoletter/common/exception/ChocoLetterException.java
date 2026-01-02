package chocolate.chocoletter.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ChocoLetterException extends RuntimeException {
    HttpStatus status;
    ErrorMessage errorMessage;

    public ChocoLetterException(HttpStatus status, ErrorMessage errorMessage) {
        super(errorMessage.toString());
        this.status = status;
        this.errorMessage = errorMessage;
    }
}
