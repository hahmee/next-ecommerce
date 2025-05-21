package org.zerock.mallapi.service;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.ConfirmRequestDTO;

@Transactional
public interface TossService {

  ResponseEntity<?> confirmPayment(ConfirmRequestDTO request);

}
