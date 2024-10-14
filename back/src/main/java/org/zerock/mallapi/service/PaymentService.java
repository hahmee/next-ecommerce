package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface PaymentService {

  PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, String email);

  PaymentFailDTO tossPaymentFail(PaymentRequestDTO paymentRequestDTO);

  List<PaymentDTO> getList();

  PaymentDTO getByEmailAndOrderId(String email, String orderId);

  PageResponseDTO<PaymentDTO> getSearchAdminPaymentList(SearchRequestDTO searchRequestDTO, String email);

}
