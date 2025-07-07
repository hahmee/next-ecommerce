package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
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
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/success")
    public DataResponseDTO<PaymentSuccessDTO> tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, Principal principal) {

        String email = principal.getName();

        PaymentSuccessDTO paymentSuccessDTO = paymentService.tossPaymentSuccess(paymentRequestDTO, email);


        return DataResponseDTO.of(paymentSuccessDTO);

    }

    //성공시 여기로 redirect
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/{id}") // payments/123123
    public DataResponseDTO<PaymentDTO> get(@PathVariable(name ="id") String id) {

        PaymentDTO paymentDTO = paymentService.getByPaymentKey(id);


        return DataResponseDTO.of(paymentDTO);

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/list")
    public DataResponseDTO<List<PaymentDTO>> list() {

        return DataResponseDTO.of(paymentService.getList());

    }


    /*사용 x */
    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/fail") // payment/fail?
    public DataResponseDTO<PaymentFailDTO> tossPaymentFail(PaymentRequestDTO paymentRequestDTO) {


        paymentService.tossPaymentFail(paymentRequestDTO);

        return null;

    }



    //ADMIN 페이지 추가
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
    @GetMapping("/searchAdminPaymentList") // searchAdminPaymentList?search=검색어&page=1&size=10
    public DataResponseDTO<PageResponseDTO<PaymentDTO>> searchAdminPaymentList(SearchRequestDTO searchRequestDTO, Principal principal) {

        String email = principal.getName();

        DataResponseDTO<PageResponseDTO<PaymentDTO>> result =  DataResponseDTO.of(paymentService.getSearchAdminPaymentList(searchRequestDTO, email));

        return result;

    }


    //ADMIN 페이지 추가
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
    @GetMapping("/paymentsOverview")
    public DataResponseDTO<PaymentSummaryDTO> getAdminPaymentOverview(SearchRequestDTO searchRequestDTO, Principal principal) {

        String email = principal.getName();

        DataResponseDTO<PaymentSummaryDTO> result = DataResponseDTO.of(paymentService.getAdminPaymentOverview(searchRequestDTO, email));

        return result;

    }


    //ADMIN 페이지 추가
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')") //임시로 권한 설정
    @GetMapping("/searchAdminOrders")
    public DataResponseDTO<PageResponseDTO<AdminOrderDTO>> searchAdminOrders(SearchRequestDTO searchRequestDTO, Principal principal) {

        String email = principal.getName();

        DataResponseDTO<PageResponseDTO<AdminOrderDTO>> result =  DataResponseDTO.of(paymentService.getSearchAdminOrders(searchRequestDTO, email));

        return result;
    }



}
