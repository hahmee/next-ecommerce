package org.zerock.mallapi.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Order;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long>{

    @Query("select o from Order o where o.orderId = :orderId")
    List<Order> selectListByOrderId(@Param("orderId") String orderId);


    //////////////////////////////////////////////////////////////////////////////////////////////
    @Query("SELECT SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty), AVG(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate ")
    List<Object[]> findSalesOrdersAvg(@Param("email") String email,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate
                                   );

    // 비교 날짜 범위의 집계 데이터 가져오기
    @Query("SELECT SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty), AVG(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :comparedStartDate AND :comparedEndDate")
    List<Object[]> findComparedSalesOrdersAvg(@Param("email") String email,
                                     @Param("comparedStartDate") LocalDateTime comparedStartDate,
                                     @Param("comparedEndDate") LocalDateTime comparedEndDate);

    //////////////////////////////////////////////////////////////////////////////////////////////
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
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('YEARWEEK', o.createdAt, 3), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('YEARWEEK', o.createdAt, 3)")
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
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('YEARWEEK', o.createdAt, 3), SUM(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('YEARWEEK', o.createdAt, 3)")
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


    // DAY 필터용 쿼리
    @Query("SELECT DATE(o.createdAt), AVG(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY DATE(o.createdAt)")
    List<Object[]> findOrderAvgSummaryByDay(@Param("email") String email,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);


    // WEEK 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('YEARWEEK', o.createdAt, 3), AVG(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), FUNCTION('YEARWEEK', o.createdAt, 3)")
    List<Object[]> findOrderAvgSummaryByWeek(@Param("email") String email,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);


    // MONTH 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt), AVG(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt), FUNCTION('MONTH', o.createdAt)")
    List<Object[]> findOrderAvgSummaryByMonth(@Param("email") String email,
                                           @Param("startDate") LocalDateTime startDate,
                                           @Param("endDate") LocalDateTime endDate);

    // YEAR 필터용 쿼리
    @Query("SELECT FUNCTION('YEAR', o.createdAt), AVG(o.productInfo.qty) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY FUNCTION('YEAR', o.createdAt)")
    List<Object[]> findOrderAvgSummaryByYear(@Param("email") String email,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);







    ///////////////////////////////////////////////////////////////////////////////////////



    @Query("SELECT o.owner.email, COUNT(o.productInfo.qty), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax) " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY o.owner.email " +
            "ORDER BY SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax) DESC")
    List<Object[]> findTopCustomers(@Param("email") String email,
                                    @Param("startDate") LocalDateTime startDate,
                                    @Param("endDate") LocalDateTime endDate,
                                    Pageable pageable);

    ///////////////////////////////////////////////////////////////////////////////////////

    @Query("SELECT o.productInfo.pno, o.productInfo.pname, o.productInfo.color, o.productInfo.size, COUNT(o.productInfo.qty), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), o.productInfo.thumbnailUrl " +
            "FROM Order o " +
            "WHERE o.seller.email = :email " +
            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
            "AND o.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY o.productInfo.pno " +
            "ORDER BY SUM(o.productInfo.qty) DESC")
    List<Object[]> findTopProducts1(@Param("email") String email,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate,
                                   Pageable pageable);




    @Query(value = "SELECT t.pno, t.pname, t.size, c.text AS color_name, COUNT(t.qty) AS cnt, " +
            "SUM(t.qty * t.price + t.shipping_fee + t.tax) AS gross, t.thumbnail_url, " +
            "ROUND(COUNT(t.qty) * 100.0 / (SELECT COUNT(*) FROM tbl_order " +
            "                              WHERE member_seller = :email " +
            "                                AND status = 1 " +
            "                                AND created_at BETWEEN :startDate AND :endDate), 2) AS percent_of_total " +
            "FROM tbl_order t " +
            "JOIN tbl_color_tag c ON t.color_id = c.id " +
            "WHERE t.member_seller = :email " +
            "  AND t.status = 1 " +
            "  AND t.created_at BETWEEN :startDate AND :endDate " +
            "GROUP BY t.pno, t.pname, t.size, c.text, t.thumbnail_url " +
            "ORDER BY cnt DESC",
            nativeQuery = true)
    List<Object[]> findTopProducts(@Param("email") String email,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate,
                                   Pageable pageable);



    ///////////////////////////////////////////////////////////////////////////////////////
















//    // 각 날짜별로 총 매출, 총 매출, 총 주문 수, 평균 주문 금액을 반환
//    @Query("SELECT DATE(o.createdAt), SUM(o.productInfo.qty * o.productInfo.price), SUM(o.productInfo.qty * o.productInfo.price + o.shippingFee + o.tax), AVG(o.totalAmount), AVG(o.totalAmount) " +
//            "FROM Order o " +
//            "WHERE o.seller.email = :email " +
//            "AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " +
//            "AND o.createdAt BETWEEN :startDate AND :endDate " +
//            "GROUP BY DATE(o.createdAt)")
//    List<Object[]> findSalesSummary(@Param("email") String email, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("filter") String filter);

}
