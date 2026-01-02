package chocolate.chocoletter.common.handler;

import chocolate.chocoletter.common.exception.ChocoLetterException;
import chocolate.chocoletter.common.exception.ErrorMessage;
import chocolate.chocoletter.common.exception.FailResponse;
import chocolate.chocoletter.common.exception.FailResponse.ValidationError;
import jakarta.validation.ConstraintViolationException;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ChocoLetterException.class)
    public ResponseEntity<FailResponse> handleGlobalException(ChocoLetterException exception) {
        log.warn("[ChocoLetterException] {}: {}", exception.getClass().getName(), exception.getErrorMessage());

        return ResponseEntity.status(exception.getStatus())
                .body(FailResponse.fail(exception.getStatus().value(), exception.getErrorMessage()));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request
    ) {
        log.warn("[MethodArgumentNotValidException] {}: {}", ex.getClass().getName(), ex.getMessage());

        BindingResult bindingResult = ex.getBindingResult();
        List<ValidationError> validationErrors = bindingResult.getFieldErrors()
                .stream()
                .map(error -> ValidationError.of(error))
                .toList();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(FailResponse.failFromMethodArgumentNotValid(HttpStatus.BAD_REQUEST.value(),
                        ErrorMessage.ERR_INVALID_REQUEST_FIELD, validationErrors));
    }

    @Override
    protected ResponseEntity<Object> handleNoResourceFoundException(
            NoResourceFoundException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request
    ) {
        log.warn("[NoResourceFoundException] {}: {}", ex.getClass().getName(), ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(FailResponse.fail(HttpStatus.NOT_FOUND.value(), ErrorMessage.ERR_NOT_RESOURCE));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<FailResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        log.warn("[ConstraintViolationException] {}: {}", ex.getClass().getName(), ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(FailResponse.fail(HttpStatus.BAD_REQUEST.value(), ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
    }
}
