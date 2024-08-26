package org.zerock.mallapi.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.ErrorResponseDTO;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.util.GeneralException;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
public class ErrorController {

    // http://localhost:8080/error/exception
    @GetMapping("/api/error/exception")
    public DataResponseDTO<Object> errorWithException() {
        try {
            List<Integer> list = List.of(1, 2, 3, 4, 5);

            log.debug(list.get(99999).toString()); // outofbound exception occurs

        } catch (Exception e) {
            log.info("Exception", e);
            throw e;
                /*
                  {
                    "success": false,
                    "code": 20000,
                    "message": "Internal error - Index 9 out of bounds for length 5"
                  }
                */
        }

        return DataResponseDTO.empty();
    }


}
