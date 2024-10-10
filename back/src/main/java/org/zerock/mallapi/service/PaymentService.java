package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.PaymentFailDTO;
import org.zerock.mallapi.dto.PaymentRequestDTO;
import org.zerock.mallapi.dto.PaymentSuccessDTO;

@Transactional
public interface PaymentService {

  PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, String email);

  PaymentFailDTO tossPaymentFail(PaymentRequestDTO paymentRequestDTO);



}
