package chocoletter.chat.common.exception;

import lombok.Getter;

@Getter
public enum ErrorMessage {

    /**
     * 400 Bad Request
     */
    ERR_EMPTY_TOKEN,
    ERR_INVALID_SUBSCRIBE_DESTINATION,

    /**
     * 401 Unauthorized
     */
    ERR_ACCESS_TOKEN_EXPIRED,
    ERR_INVALID_TOKEN,

    /**
     * 500 Internal Server Exception
     */
    ERR_SERIALIZE_MESSAGE,
    ERR_PARSING_MESSAGE,
    ERR_ENCRYPT_FAIL;

}
