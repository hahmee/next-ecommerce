package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.PaymentService;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;


    //성공시 여기로 redirect
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/success") // payment/success?
    public DataResponseDTO<PaymentSuccessDTO> tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, Principal principal) {
        log.info("한 번 나와야하는데..");

        log.info("===== paymentRequestDTO + " + paymentRequestDTO);

        String email = principal.getName();

        log.info("ddddd email" + email);

        PaymentSuccessDTO paymentSuccessDTO = paymentService.tossPaymentSuccess(paymentRequestDTO, email);

        log.info("결과..... " + paymentSuccessDTO);

        return DataResponseDTO.of(paymentSuccessDTO);


    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/list")
    public DataResponseDTO<List<PaymentDTO>> list() {

        return DataResponseDTO.of(paymentService.getList());

    }


    /*사용 x */
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/fail") // payment/fail?
    public DataResponseDTO<PaymentFailDTO> tossPaymentFail(PaymentRequestDTO paymentRequestDTO) {


        paymentService.tossPaymentFail(paymentRequestDTO);

        return null;

    }



    //ADMIN 페이지 추가
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
    @GetMapping("/searchAdminPaymentList") // searchAdminPaymentList?search=검색어&page=1&size=10
    public DataResponseDTO<PageResponseDTO<PaymentDTO>> searchAdminPaymentList(SearchRequestDTO searchRequestDTO, Principal principal) {

        String email = principal.getName();

        log.info("search............" + searchRequestDTO);

        DataResponseDTO<PageResponseDTO<PaymentDTO>> result =  DataResponseDTO.of(paymentService.getSearchAdminPaymentList(searchRequestDTO, email));

        log.info("최종 result", result);

        return result;

    }


    //ADMIN 페이지 추가
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
    @GetMapping("/paymentsOverview")
    public DataResponseDTO<PaymentSummaryDTO> getAdminPaymentOverview(SearchRequestDTO searchRequestDTO, Principal principal) {

        String email = principal.getName();

        log.info("search............" + searchRequestDTO);

        DataResponseDTO<PaymentSummaryDTO> result = DataResponseDTO.of(paymentService.getAdminPaymentOverview(searchRequestDTO, email));

        log.info("최종 result", result);

        return result;

    }


    //ADMIN 페이지 추가
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN')") //임시로 권한 설정
    @GetMapping("/searchAdminOrders")
    public DataResponseDTO<PageResponseDTO<AdminOrderDTO>> searchAdminOrders(SearchRequestDTO searchRequestDTO, Principal principal) {

        log.info("SearchRequestDTO" + searchRequestDTO);

//        return null;

        String email = principal.getName();

        log.info("search............" + searchRequestDTO);

        DataResponseDTO<PageResponseDTO<AdminOrderDTO>> result =  DataResponseDTO.of(paymentService.getSearchAdminOrders(searchRequestDTO, email));

        log.info("최종 result", result);

        return result;
//        return null;
    }



}
