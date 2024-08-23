package org.zerock.mallapi.dto;

import lombok.Getter;
import org.zerock.mallapi.exception.ErrorCode;




// 데이터 응답 형식
//{
//        "success": true,
//        "code": 0,
//        "message": "Ok",
//        "data": [
//          1,
//          2,
//          3
//        ]
//}

@Getter
public class DataResponseDTO<T> extends ResponseDTO {

    private final T data;

    private DataResponseDTO(T data) {
        super(true, ErrorCode.OK.getCode(), ErrorCode.OK.getMessage());
        this.data = data;
    }

    private DataResponseDTO(T data, String message) {
        super(true, ErrorCode.OK.getCode(), message);
        this.data = data;
    }

    public static <T> DataResponseDTO<T> of(T data) {
        return new DataResponseDTO<>(data);
    }

    public static <T> DataResponseDTO<T> of(T data, String message) {
        return new DataResponseDTO<>(data, message);
    }

    public static <T> DataResponseDTO<T> empty() {
        return new DataResponseDTO<>(null);
    }
}