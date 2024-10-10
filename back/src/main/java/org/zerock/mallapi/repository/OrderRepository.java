package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long>{

    @Query("select o from Order o where o.orderId = :orderId")
    List<Order> selectListByOrderId(@Param("orderId") String orderId);



}
