package org.zerock.mallapi.exception;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.zerock.mallapi.util.GeneralException;

import java.util.Arrays;
import java.util.Optional;
import java.util.function.Predicate;

@AllArgsConstructor
@Getter
public enum ErrorCode {

    OK(0, HttpStatus.OK, "Ok"),

    BAD_REQUEST(400, HttpStatus.BAD_REQUEST, "BAD_REQUEST"),
    VALIDATION_ERROR(400, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR"),
    NOT_FOUND(404, HttpStatus.NOT_FOUND, "NOT_FOUND"),

    USER_EMAIL_DUPLICATED(401, HttpStatus.UNAUTHORIZED, "DUPLICATED_EMAIL"),
    USER_NICKNAME_DUPLICATED(401, HttpStatus.UNAUTHORIZED, "DUPLICATED_NICKNAME"),

    EXPIRED_TOKEN(401, HttpStatus.UNAUTHORIZED, "EXPIRED_TOKEN"),
    NULL_TOKEN(401, HttpStatus.UNAUTHORIZED, "NULL_TOKEN"),
    INVALID_TOKEN(401, HttpStatus.UNAUTHORIZED, "INVALID_TOKEN"),



    INTERNAL_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR"),
    DATA_ACCESS_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "DATA_ACCESS_ERROR"),

    UNAUTHORIZED(401, HttpStatus.UNAUTHORIZED, "USER_UNAUTHORIZED"),

    MAX_SIZE_EXCEED(400, HttpStatus.BAD_REQUEST ,"MAX_SIZE_EXCEED"),

    TEST_MAX(400, HttpStatus.NO_CONTENT ,"NONONO");


    private final Integer code;
    private final HttpStatus httpStatus;
    private final String message;

    public String getMessage(Throwable e) {
        return this.getMessage(this.getMessage() + " - " + e.getMessage());
        // 결과 예시 - "Validation error - Reason why it isn't valid"
    }

    public String getMessage(String message) {
        return Optional.ofNullable(message)
                .filter(Predicate.not(String::isBlank))
                .orElse(this.getMessage());
    }

    public static ErrorCode valueOf(HttpStatus httpStatus) {
        if (httpStatus == null) {
            throw new GeneralException("HttpStatus is null.");
        }

        return Arrays.stream(values())
                .filter(errorCode -> errorCode.getHttpStatus() == httpStatus)
                .findFirst()
                .orElseGet(() -> {
                    if (httpStatus.is4xxClientError()) {
                        return ErrorCode.BAD_REQUEST;
                    } else if (httpStatus.is5xxServerError()) {
                        return ErrorCode.INTERNAL_ERROR;
                    } else {
                        return ErrorCode.OK;
                    }
                });
    }

    @Override
    public String toString() {
        return String.format("%s (%d)", this.name(), this.getCode());
    }
}
