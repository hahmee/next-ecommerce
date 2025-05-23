package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Payment;
import org.zerock.mallapi.dto.PaymentSummaryDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email ORDER BY p DESC ")
    List<Payment> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Payment p WHERE p.paymentKey = :paymentKey")
    Optional<Payment> findByPaymentKey(@Param("paymentKey") String paymentKey);

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email AND p.orderId = :orderId")
    Optional<Payment> findByEmailAndOrderId(@Param("email") String email, @Param("orderId") String orderId);

    @Query(
            "SELECT DISTINCT p " +
                    "FROM Payment p " +
                    "JOIN Order o ON p.orderId = o.orderId " +
                    "WHERE o.seller.email = :email " +
                    "AND (p.orderName LIKE CONCAT('%', :search, '%') " +
                    "     OR p.orderId LIKE CONCAT('%', :search, '%')) " +
                    "AND p.status = org.zerock.mallapi.domain.TossPaymentStatus.DONE " +
                    "AND p.createdAt BETWEEN :startDate AND :endDate "
    )
    Page<Payment> searchAdminPaymentList(Pageable pageable, @Param("search") String search, @Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    //Sales-Overview
    @Query("SELECT p.country, SUM(o.productInfo.qty * o.productInfo.price) " +
            "FROM Payment p " +
            "JOIN Order o ON p.orderId = o.orderId " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "WHERE o.seller.email = :email " +
            "GROUP BY p.country")
    List<Object[]> findSalesByCountry(@Param("email") String email,
                                      @Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);


    @Query("SELECT new org.zerock.mallapi.dto.PaymentSummaryDTO(COALESCE(SUM(p.totalAmount), 0), COALESCE(COUNT(p), 0)) " +
            "FROM Payment p " +
            "JOIN Order o ON p.orderId = o.orderId " +
            "WHERE o.seller.email = :email " +
            "AND p.createdAt BETWEEN :startDate AND :endDate " +
            "AND p.status = org.zerock.mallapi.domain.TossPaymentStatus.DONE ")
    PaymentSummaryDTO selectTotalPayments(@Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    @Query("SELECT p, SUM(po.productInfo.qty) as itemCount " +
            "FROM Payment p " +
            "LEFT JOIN p.orders po " +
            "WHERE po.seller.email = :email " +
            "AND (p.orderName LIKE CONCAT('%', :search, '%') " +
            "     OR p.orderId LIKE CONCAT('%', :search, '%')) " +
            "AND p.status = org.zerock.mallapi.domain.TossPaymentStatus.DONE " +
            "AND p.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY p.id"
    )
    Page<Object[]> searchAdminOrders(Pageable pageable, @Param("search") String search, @Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);


    boolean existsByPaymentKey(String paymentKey);
}
