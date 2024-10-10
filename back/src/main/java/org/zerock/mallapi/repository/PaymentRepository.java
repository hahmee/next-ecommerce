package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mallapi.domain.Order;
import org.zerock.mallapi.domain.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{


}
