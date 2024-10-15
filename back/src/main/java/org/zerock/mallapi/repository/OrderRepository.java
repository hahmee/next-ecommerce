package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Order;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long>{

    @Query("select o from Order o where o.orderId = :orderId")
    List<Order> selectListByOrderId(@Param("orderId") String orderId);

    // 각 날짜별로 총 매출, 총 주문 수, 평균 주문 금액을 반환
    @Query("SELECT DATE(o.createdAt), SUM(o.totalAmount), AVG(o.totalAmount), AVG(o.totalAmount) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(o.createdAt)")
    List<Object[]> findSalesSummary(@Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

}
