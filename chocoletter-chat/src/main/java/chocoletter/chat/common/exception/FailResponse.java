package chocoletter.chat.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.springframework.validation.FieldError;

@Getter
@Builder
public class FailResponse {
    private final int status;
    private final String errorMessage;

    public static FailResponse fail(int status, ErrorMessage errorMessage) {
        return FailResponse.builder()
                .status(status)
                .errorMessage(errorMessage.toString())
                .build();
    }

}
