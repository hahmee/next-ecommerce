package org.zerock.mallapi.exception;

import lombok.*;
import org.springframework.http.HttpStatus;
import org.zerock.mallapi.util.GeneralException;

import java.util.Arrays;
import java.util.Optional;
import java.util.function.Predicate;

@AllArgsConstructor
@Getter
public enum Code {
    // 충돌 방지를 위한 Code format
    // X1XXX: 제이
    // X2XXX: 셀리나
    // X3XXX: 메이슨
    // ex) 메이슨이 닉네임 중복 에러코드를 만든다면
    // USER_NICKNAME_DUPLICATED(13010, HttpStatus.BAD_REQUEST, "User nickname duplicated"),

    OK(0, HttpStatus.OK, "Ok"),

    BAD_REQUEST(400, HttpStatus.BAD_REQUEST, "Bad request"),
    VALIDATION_ERROR(400, HttpStatus.BAD_REQUEST, "Validation error"),
    NOT_FOUND(404, HttpStatus.NOT_FOUND, "Requested resource is not found"),

    USER_EMAIL_DUPLICATED(401, HttpStatus.UNAUTHORIZED, "DUPLICATED_EMAIL"),
    USER_NICKNAME_DUPLICATED(401, HttpStatus.UNAUTHORIZED, "DUPLICATED_NICKNAME"),

    TOKEN_EXPIRED(401, HttpStatus.UNAUTHORIZED, "TOKEN_ERROR"),
    TOKEN_NULL(401, HttpStatus.UNAUTHORIZED, "TOKEN_NULL"),
    TOKEN_INVALID(401, HttpStatus.UNAUTHORIZED, "TOKEN_INVALID"),


    INTERNAL_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR"),
    DATA_ACCESS_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "DATA_ACCESS_ERROR"),

    UNAUTHORIZED(401, HttpStatus.UNAUTHORIZED, "USER_UNAUTHORIZED");


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

    public static Code valueOf(HttpStatus httpStatus) {
        if (httpStatus == null) {
            throw new GeneralException("HttpStatus is null.");
        }

        return Arrays.stream(values())
                .filter(errorCode -> errorCode.getHttpStatus() == httpStatus)
                .findFirst()
                .orElseGet(() -> {
                    if (httpStatus.is4xxClientError()) {
                        return Code.BAD_REQUEST;
                    } else if (httpStatus.is5xxServerError()) {
                        return Code.INTERNAL_ERROR;
                    } else {
                        return Code.OK;
                    }
                });
    }

    @Override
    public String toString() {
        return String.format("%s (%d)", this.name(), this.getCode());
    }
}
