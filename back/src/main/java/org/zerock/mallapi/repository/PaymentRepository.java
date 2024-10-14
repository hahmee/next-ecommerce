package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Payment;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email ORDER BY p DESC ")
    List<Payment> findByUserEmail(@Param("email") String email);

    @Query("SELECT p FROM Payment p WHERE p.owner.email = :email AND p.orderId = :orderId")
    Optional<Payment> findByEmailAndOrderId(@Param("email") String email, @Param("orderId") String orderId);

    @Query("select p from Payment p where p.orderId LIKE CONCAT('%',:search,'%') and p.owner.email = :email")
    Page<Object[]> searchAdminPaymentList(Pageable pageable, @Param("search") String search, @Param("email") String email);


}
