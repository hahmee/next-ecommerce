package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.PaymentDTO;
import org.zerock.mallapi.dto.PaymentFailDTO;
import org.zerock.mallapi.dto.PaymentRequestDTO;
import org.zerock.mallapi.dto.PaymentSuccessDTO;

import java.util.List;

@Transactional
public interface PaymentService {

  PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, String email);

  PaymentFailDTO tossPaymentFail(PaymentRequestDTO paymentRequestDTO);

  List<PaymentDTO> getList();

  PaymentDTO getByEmailAndOrderId(String email, String orderId);


}
