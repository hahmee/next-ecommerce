package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.OrderService;
import org.zerock.mallapi.service.PaymentService;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @PostMapping("/")
    public DataResponseDTO<Long> register(@RequestBody OrderDTO orderDTO, Principal principal) {

        log.info("===== orderDTO + " + orderDTO);

        log.info("principal....?" + principal);

        String email = principal.getName();

        Long id = orderService.register(orderDTO, email);

        return DataResponseDTO.of(id);

    }

}
