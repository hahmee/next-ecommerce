package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Payment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email ORDER BY p DESC ")
    List<Payment> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email AND p.orderId = :orderId")
    Optional<Payment> findByEmailAndOrderId(@Param("email") String email, @Param("orderId") String orderId);

    @Query("select distinct p from Payment p join Order o on p.orderId = o.orderId where o.seller.email = :email and (p.orderName like concat('%', :search, '%') or p.orderId like concat('%', :search, '%')) and p.status = org.zerock.mallapi.domain.TossPaymentStatus.DONE")
    Page<Payment> searchAdminPaymentList(Pageable pageable, @Param("search") String search, @Param("email") String email);

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



}
