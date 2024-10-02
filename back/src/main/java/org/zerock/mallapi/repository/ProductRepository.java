package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Product;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>{


//  @EntityGraph(attributePaths = "imageList")
//  @Query("select p from Product p where p.pno = :pno")
  @Query("select p from Product p left join p.imageList left join p.colorList where p.pno = :pno")
  Optional<Product> selectOne(@Param("pno") Long pno);

  @Modifying
  @Query("update Product p set p.delFlag = :flag where p.pno = :pno")
  void updateToDelete(@Param("pno") Long pno , @Param("flag") boolean flag);



  @Query("select p, pi from Product p left join p.imageList pi " +
          "left join p.sizeList ps " +
          "left join p.colorList pc " +
          "where (NULLIF(pi.ord, ' ') IS NULL or pi.ord = 0) " +
          "and p.delFlag = false " +
          "and (:productSizes IS NULL or ps IN :productSizes) " +
          "and (:colors IS NULL or pc.text IN :colors) " +
          "and p.adminCategory.cno IN :categoryIds " +
          "and (:minPrice IS NULL OR :maxPrice IS NULL OR p.price BETWEEN :minPrice AND :maxPrice) " + // 가격 필터 추가
          "GROUP BY p.pno")
  Page<Object[]> selectList(Pageable pageable, @Param("categoryIds") List<Long> categoryIds, @Param("colors") List<String> colors, @Param("productSizes") List<String> productSizes, @Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice);

//  @Query("select p, pi from Product p left join p.imageList pi " +
//          "where (NULLIF(pi.ord, ' ') IS NULL or pi.ord = 0) " +
//          "and p.delFlag = false " +
//          "and p.adminCategory.cno IN :categoryIds")
//  Page<Object[]> selectList(Pageable pageable, @Param("categoryIds") List<Long> categoryIds);

  @Query("select p, pi from Product p left join p.imageList pi where (NULLIF(pi.ord, ' ') IS NULL or pi.ord = 0) and p.delFlag = false and p.owner.email = :email")
  Page<Object[]> selectAdminList(Pageable pageable, @Param("email") String email);

  @Query("select p, pi from Product p left join p.imageList pi where p.pname LIKE CONCAT('%',:search,'%') and (NULLIF(pi.ord, ' ') IS NULL or pi.ord = 0) and p.delFlag = false and p.owner.email = :email")
  Page<Object[]> searchAdminList(Pageable pageable, @Param("search") String search, @Param("email") String email);



}
