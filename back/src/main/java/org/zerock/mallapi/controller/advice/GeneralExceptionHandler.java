package org.zerock.mallapi.controller.advice;

import lombok.extern.log4j.Log4j2;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.zerock.mallapi.dto.ErrorResponseDTO;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.util.GeneralException;

/*
    GeneralException 발생 시, 프런트로 보낼 ErrorDTO 를 생성하고, ErrorDTO를 전달하는 handler.
 */

@Log4j2
@RestControllerAdvice
public class GeneralExceptionHandler extends ResponseEntityExceptionHandler {


    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> handleMaxSizeException(MaxUploadSizeExceededException e, WebRequest request) {
        log.info("=====================handleMaxSizeException");
        return handleExceptionInternal(e, ErrorCode.MAX_SIZE_EXCEED, request);
    }


    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        log.info("===================errorMessage " + errorMessage);

        return super.handleExceptionInternal(
                ex,
                ErrorResponseDTO.of(ErrorCode.VALIDATION_ERROR, errorMessage),
                headers,
                status,
                request
        );
    }


    @ExceptionHandler
    public ResponseEntity<Object> validation(ConstraintViolationException e, WebRequest request) {
        log.info("1------------occurs Exception");

        return handleExceptionInternal(e, ErrorCode.VALIDATION_ERROR, request);
    }

    @ExceptionHandler
    public ResponseEntity<Object> general(GeneralException e, WebRequest request) {
        log.info("2------------occurs Exception");

        return handleExceptionInternal(e, e.getErrorCode(), request);
    }

    @ExceptionHandler
    public ResponseEntity<Object> exception(Exception e, WebRequest request) {
        log.info("3------------");
        return handleExceptionInternal(e, ErrorCode.INTERNAL_ERROR, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers, HttpStatusCode statusCode, WebRequest request) {
        log.info("4------------"+ statusCode); //400 BAD_REQUEST
        log.info("======== 0 " + ErrorCode.valueOf(HttpStatus.valueOf(statusCode.value())));//400 BAD_REQUEST
        log.info("===========" + ex.getMessage());

        return generalHandleExceptionInternal(ex, ErrorCode.valueOf(HttpStatus.valueOf(statusCode.value())), headers, statusCode, request);

    }

    private ResponseEntity<Object> handleExceptionInternal(Exception e, ErrorCode errorCode, WebRequest request) {
        log.info("5------------" + errorCode);
        return generalHandleExceptionInternal(e, errorCode, HttpHeaders.EMPTY, errorCode.getHttpStatus(), request);
    }

    private ResponseEntity<Object> generalHandleExceptionInternal(Exception e, ErrorCode errorCode, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        log.info("6------------" + errorCode); //MAX_SIZE_EXCEED (400)
        log.info("6------------" + status); //400 BAD_REQUEST

        return super.handleExceptionInternal(
                e,
                ErrorResponseDTO.of(errorCode, errorCode.getMessage(e)),
                headers,
                status,
                request
        );
    }
}