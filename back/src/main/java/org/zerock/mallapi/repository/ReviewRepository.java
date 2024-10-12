package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long>{

    @Query("SELECT r FROM Review r WHERE r.order.id = :oid")
    Optional<Review> findByOid(@Param("oid") Long oid);

    @Query("SELECT r FROM Review r WHERE r.product.pno = :pno ORDER BY r DESC")
    List<Review> findAllByPno(@Param("pno") Long pno);



}
