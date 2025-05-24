package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.*;

import java.util.List;

@Transactional
public interface PaymentService {

  PaymentSuccessDTO tossPaymentSuccess(PaymentRequestDTO paymentRequestDTO, String email);

  PaymentFailDTO tossPaymentFail(PaymentRequestDTO paymentRequestDTO);

  List<PaymentDTO> getList();

  PaymentDTO getByPaymentKey(String paymentKey);

  PaymentDTO getByEmailAndOrderId(String email, String orderId);

  PageResponseDTO<PaymentDTO> getSearchAdminPaymentList(SearchRequestDTO searchRequestDTO, String email);

  //Dashboard사용
  List<Object[]> getSalesByCountry(TopCustomerRequestDTO topCustomerRequestDTO);

  PaymentSummaryDTO getAdminPaymentOverview(SearchRequestDTO searchRequestDTO, String email);

  PageResponseDTO<AdminOrderDTO> getSearchAdminOrders(SearchRequestDTO searchRequestDTO, String email);

  void savePaymentAfterSuccess(PaymentSuccessDTO paymentSuccessDTO, Member member);

  boolean existsByPaymentKey(String paymentKey);

}
