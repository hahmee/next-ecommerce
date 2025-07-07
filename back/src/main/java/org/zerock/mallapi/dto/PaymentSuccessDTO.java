package org.zerock.mallapi.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import org.zerock.mallapi.domain.TossPaymentMethod;
import org.zerock.mallapi.domain.TossPaymentStatus;
import org.zerock.mallapi.domain.TossPaymentType;

@Data
@Getter
public class PaymentSuccessDTO {
  @JsonProperty("mId") // JSON에서 "mId"로 오는 필드를 명확하게 매핑
  String mId;
  String lastTransactionKey;
  String paymentKey;
  String orderId;
  String orderName;
  Integer taxFreeAmount; // int → Integer 변경 (null 허용)
  Integer taxExemptionAmount; // 새로 추가된 필드
  TossPaymentStatus status;
  String requestedAt;
  String approvedAt;
  Boolean useEscrow;
  Boolean cultureExpense;
  CardInfo card;
  Object virtualAccount;
  Object transfer;
  Object mobilePhone;
  Object giftCertificate;
  Object cashReceipt;
  Object cashReceipts;
  Object discount;
  Object cancels;
  String secret;
  TossPaymentType type;
  EasyPayInfo easyPay;
  String country;
  Object failure;
  Boolean isPartialCancelable; // boolean → Boolean 변경 (null 허용)
  ReceiptInfo receipt;
  CheckoutInfo checkout;
  String currency;
  Integer totalAmount; // int → Integer 변경 (null 허용)
  Integer balanceAmount;
  Integer suppliedAmount;
  Integer vat;
  TossPaymentMethod method;
  String version;
  Object metadata;

  // 카드 결제 정보 DTO
  @Data
  public static class CardInfo {
    String issuerCode;
    String acquirerCode;
    String number;
    Integer installmentPlanMonths;
    Boolean isInterestFree;
    String interestPayer;
    String approveNo;
    Boolean useCardPoint;
    String cardType;
    String ownerType;
    String acquireStatus;
    Integer amount;
  }

  // 간편결제 정보 DTO
  @Data
  public static class EasyPayInfo {
    String provider;
    Integer amount;
    Integer discountAmount;
  }

  // 영수증 정보 DTO
  @Data
  public static class ReceiptInfo {
    String url;
  }

  // 체크아웃 정보 DTO
  @Data
  public static class CheckoutInfo {
    String url;
  }

  // 가상 계좌 결제 정보 DTO
  @Data
  public static class VirtualAccountInfo {
    String accountType;
    String accountNumber;
    String bankCode;
    String customerName;
    String dueDate;
    String refundStatus;
    String expired;
    String settlementStatus;
  }

  // 계좌이체 정보 DTO
  @Data
  public static class TransferInfo {
    String bankCode;
    String settlementStatus;
  }

  // 휴대폰 결제 정보 DTO
  @Data
  public static class MobilePhoneInfo {
    String customerMobilePhone;
    String settlementStatus;
  }

  // 상품권 결제 정보 DTO
  @Data
  public static class GiftCertificateInfo {
    String approveNo;
    String settlementStatus;
  }

  // 현금영수증 정보 DTO
  @Data
  public static class CashReceiptInfo {
    String type;
    String amount;
    String taxFreeAmount;
    String issueNumber;
  }

  // 할인 정보 DTO
  @Data
  public static class DiscountInfo {
    String amount;
  }

  // 취소 정보 DTO
  @Data
  public static class CancelInfo {
    String cancelAmount;
    String cancelReason;
    String taxFreeAmount;
    String taxAmount;
    String refundableAmount;
    String canceledAt;
  }
}
