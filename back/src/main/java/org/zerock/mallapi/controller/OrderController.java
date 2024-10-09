package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.PaymentFailDTO;
import org.zerock.mallapi.dto.PaymentRequestDTO;
import org.zerock.mallapi.dto.PaymentSuccessDTO;
import org.zerock.mallapi.service.PaymentService;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;


    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @PostMapping("/")
    public DataResponseDTO<Long> register(OrderDTO orderDTO) {

        log.info("===== orderDTO + " + orderDTO);

        Long id = orderService.register(orderDTO);

        return DataResponseDTO.of(id);

    }

}
