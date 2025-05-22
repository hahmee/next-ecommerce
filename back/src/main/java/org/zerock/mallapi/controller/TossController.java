package org.zerock.mallapi.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.ConfirmRequestDTO;
import org.zerock.mallapi.service.OrderService;
import org.zerock.mallapi.service.TossService;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/toss/confirm")
public class TossController {

    private final TossService tossService;


    @PostMapping
    public ResponseEntity<?> confirm(@RequestBody ConfirmRequestDTO confirmRequestDTO) {

        log.info("confirmRequestDTO " + confirmRequestDTO);
        return tossService.confirmPayment(confirmRequestDTO);
    }
}