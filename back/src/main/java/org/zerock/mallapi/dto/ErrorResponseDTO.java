package org.zerock.mallapi.dto;

import org.zerock.mallapi.exception.ErrorCode;


// 에러 응답 형식
//
//{
//        "success": false,
//        "code": 10001,
//        "message": "Validation error - Reason why it isn't valid"
//}

public class ErrorResponseDTO extends ResponseDTO {

    private ErrorResponseDTO(ErrorCode errorCode) {
        super(false, errorCode.getCode(), errorCode.getMessage());
    }

    private ErrorResponseDTO(ErrorCode errorCode, Exception e) {
        super(false, errorCode.getCode(), errorCode.getMessage(e));
    }

    private ErrorResponseDTO(ErrorCode errorCode, String message) {
        super(false, errorCode.getCode(), errorCode.getMessage(message));
    }


    public static ErrorResponseDTO of(ErrorCode errorCode) {
        return new ErrorResponseDTO(errorCode);
    }

    public static ErrorResponseDTO of(ErrorCode errorCode, Exception e) {
        return new ErrorResponseDTO(errorCode, e);
    }

    public static ErrorResponseDTO of(ErrorCode errorCode, String message) {
        return new ErrorResponseDTO(errorCode, message);
    }
}