package org.zerock.mallapi.dto;

import org.zerock.mallapi.exception.Code;


// 에러 응답 형식
//
//{
//        "success": false,
//        "code": 10001,
//        "message": "Validation error - Reason why it isn't valid"
//}

public class ErrorResponseDTO extends ResponseDTO {

    private ErrorResponseDTO(Code errorCode) {
        super(false, errorCode.getCode(), errorCode.getMessage());
    }

    private ErrorResponseDTO(Code errorCode, Exception e) {
        super(false, errorCode.getCode(), errorCode.getMessage(e));
    }

    private ErrorResponseDTO(Code errorCode, String message) {
        super(false, errorCode.getCode(), errorCode.getMessage(message));
    }


    public static ErrorResponseDTO of(Code errorCode) {
        return new ErrorResponseDTO(errorCode);
    }

    public static ErrorResponseDTO of(Code errorCode, Exception e) {
        return new ErrorResponseDTO(errorCode, e);
    }

    public static ErrorResponseDTO of(Code errorCode, String message) {
        return new ErrorResponseDTO(errorCode, message);
    }
}