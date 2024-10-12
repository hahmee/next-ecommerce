package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.OrderService;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @PostMapping("/")
    public DataResponseDTO<String> register(@RequestBody OrderRequestDTO orderRequestDTO, Principal principal) {

        log.info("===== orderDTO + " + orderRequestDTO);

        log.info("principal....?" + principal);

        String email = principal.getName();

        orderService.register(orderRequestDTO, email);

        return DataResponseDTO.of("SUCCESS");

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/list/{orderId}")
    public DataResponseDTO<List<OrderDTO>> list(@PathVariable(name="orderId") String orderId) {

        return DataResponseDTO.of(orderService.getList(orderId));

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/{id}")
    public DataResponseDTO<OrderDTO> get(@PathVariable(name="id") Long id) {

        return DataResponseDTO.of(orderService.get(id));

    }



}
