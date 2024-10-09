package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mallapi.domain.Order;

public interface OrderRepository extends JpaRepository<Order, Long>{


}
