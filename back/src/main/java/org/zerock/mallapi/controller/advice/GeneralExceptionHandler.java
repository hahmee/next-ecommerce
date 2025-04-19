package org.zerock.mallapi.controller.advice;

import lombok.extern.log4j.Log4j2;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.zerock.mallapi.dto.ErrorResponseDTO;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.util.GeneralException;

@Log4j2
@RestControllerAdvice
public class GeneralExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * 파일 업로드 용량 초과
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxSizeException(MaxUploadSizeExceededException e, WebRequest request) {
        return handleExceptionInternal(e, ErrorCode.MAX_SIZE_EXCEED, request);
    }

    /**
     * @Valid 유효성 실패 - DTO 필드 오류
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return super.handleExceptionInternal(
                ex,
                ErrorResponseDTO.of(ErrorCode.VALIDATION_ERROR, errorMessage),
                headers,
                status,
                request
        );
    }

    /**
     * Hibernate Validator 제약 조건 위반
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> validation(ConstraintViolationException e, WebRequest request) {
        return handleExceptionInternal(e, ErrorCode.VALIDATION_ERROR, request);
    }

    /**
     * 커스텀 GeneralException
     */
    @ExceptionHandler(GeneralException.class)
    public ResponseEntity<Object> general(GeneralException e, WebRequest request) {
        return handleExceptionInternal(e, e.getErrorCode(), request);
    }

    /**
     * 인증 실패: AuthenticationEntryPoint fallback
     */
    @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
    public ResponseEntity<Object> authenticationError(AuthenticationCredentialsNotFoundException e, WebRequest request) {
        return handleExceptionInternal(e, ErrorCode.UNAUTHORIZED, request);
    }

    /**
     * 인가 실패: AccessDeniedHandler fallback
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> accessDenied(AccessDeniedException e, WebRequest request) {
        log.info("AccessDeniedException fallback triggered");
        return handleExceptionInternal(e, ErrorCode.FORBIDDEN, request);
    }

    /**
     * 그 외 모든 예외
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> exception(Exception e, WebRequest request) {
        log.warn("Unhandled Exception: {}", e.getMessage());
        return handleExceptionInternal(e, ErrorCode.INTERNAL_ERROR, request);
    }

    /**
     * 공통 내부 처리
     */
    private ResponseEntity<Object> handleExceptionInternal(Exception e, ErrorCode errorCode, WebRequest request) {
        return super.handleExceptionInternal(
                e,
                ErrorResponseDTO.of(errorCode, errorCode.getMessage(e)),
                new HttpHeaders(),
                errorCode.getHttpStatus(),
                request
        );
    }
}
