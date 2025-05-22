package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.ConfirmRequestDTO;
import org.zerock.mallapi.dto.DataResponseDTO;

@Transactional
public interface TossService {

  DataResponseDTO confirmPayment(ConfirmRequestDTO request);

}
