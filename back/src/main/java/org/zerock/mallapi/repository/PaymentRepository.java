package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Order;
import org.zerock.mallapi.domain.Payment;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email")
    List<Payment> findByUserEmail(@Param("email") String email);

}
