package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.PaymentRequestDTO;
import org.zerock.mallapi.dto.TodoDTO;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/payment")
public class PaymentController {

    //성공시 여기로 redirect
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/") // payment?
    public DataResponseDTO<TodoDTO> get(PaymentRequestDTO paymentRequestDTO) {
        //    @RequestParam String paymentKey,
        //        @RequestParam String orderId,
        //        @RequestParam Long amount 으로도 되지 않아?

        log.info("===== paymentRequestDTO + " + paymentRequestDTO);



//        return service.get(tno);
        return null;
    }
}
