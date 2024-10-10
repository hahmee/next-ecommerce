package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.PaymentFailDTO;
import org.zerock.mallapi.dto.PaymentRequestDTO;
import org.zerock.mallapi.dto.PaymentSuccessDTO;
import org.zerock.mallapi.service.PaymentService;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;


    //성공시 여기로 redirect
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/success") // payment/success?
    public DataResponseDTO<PaymentSuccessDTO> tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, Principal principal) {

        log.info("===== paymentRequestDTO + " + paymentRequestDTO);

        String email = principal.getName();

        log.info("ddddd email" + email);

        PaymentSuccessDTO paymentSuccessDTO = paymentService.tossPaymentSuccess(paymentRequestDTO, email);

        log.info("결과..... " + paymentSuccessDTO);

        return DataResponseDTO.of(paymentSuccessDTO);


    }



    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/fail") // payment/fail?
    public DataResponseDTO<PaymentFailDTO> tossPaymentFail(PaymentRequestDTO paymentRequestDTO) {


        paymentService.tossPaymentFail(paymentRequestDTO);

        return null;

    }
}
