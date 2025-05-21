package org.zerock.mallapi.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.ConfirmRequestDTO;
import org.zerock.mallapi.service.TossService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/toss/confirm")
public class TossController {

    private final TossService tossService;

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @PostMapping
    public ResponseEntity<?> confirm(@RequestBody ConfirmRequestDTO confirmRequestDTO) {
        return tossService.confirmPayment(confirmRequestDTO);
    }
}