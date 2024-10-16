package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Order;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long>{

    @Query("select o from Order o where o.orderId = :orderId")
    List<Order> selectListByOrderId(@Param("orderId") String orderId);



    // DAY 필터용 쿼리
    @Query("SELECT DATE(o.createdAt), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(o.createdAt)")
    List<Object[]> findSalesSummaryByDay(@Param("email") String email,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);


    // WEEK 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('WEEK', o.createdAt), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('WEEK', o.createdAt)")
    List<Object[]> findSalesSummaryByWeek(@Param("email") String email,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    // MONTH 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt)")
    List<Object[]> findSalesSummaryByMonth(@Param("email") String email,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    // YEAR 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt)")
    List<Object[]> findSalesSummaryByYear(@Param("email") String email,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);




///////////////////////////////////////////////////////////

    // DAY 필터용 쿼리
    @Query("SELECT DATE(o.createdAt), SUM(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(o.createdAt)")
    List<Object[]> findOrderSummaryByDay(@Param("email") String email,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);


    // WEEK 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('WEEK', o.createdAt), SUM(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('WEEK', o.createdAt)")
    List<Object[]> findOrderSummaryByWeek(@Param("email") String email,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);

    // MONTH 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), SUM(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt)")
    List<Object[]> findOrderSummaryByMonth(@Param("email") String email,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    // YEAR 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), SUM(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt)")
    List<Object[]> findOrderSummaryByYear(@Param("email") String email,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);







//////////////////////////////////////////////////////////////////////////////////////////






//    // 각 날짜별로 총 매출, 총 매출, 총 주문 수, 평균 주문 금액을 반환
//    @Query("SELECT DATE(o.createdAt), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount), AVG(o.totalAmount) " +
//            "FROM Order o " +
//            "WHERE o.seller.email = :email " +
//            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
//            "AND o.createdAt BETWEEN :startDate AND :endDate " +
//            "GROUP BY DATE(o.createdAt)")
//    List<Object[]> findSalesSummary(@Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("filter") String filter);

}
