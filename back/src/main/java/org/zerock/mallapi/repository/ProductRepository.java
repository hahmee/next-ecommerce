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

  @Query("select p, pi, AVG(COALESCE(r.rating, 0)) as avgRating, COUNT(DISTINCT r) as reviewCount, COUNT(DISTINCT o) as salesCount from Product p left join p.imageList pi " +
          "left join p.sizeList ps " +
          "left join p.colorList pc " +
          "left join Review r ON r.product.pno = p.pno " +
          "left join Order o ON o.productInfo.pno = p.pno AND o.status = org.zerock.mallapi.domain.OrderStatus.PAYMENT_CONFIRMED " + // 조건 추가
          "where (NULLIF(pi.ord, ' ') IS NULL OR pi.ord = 0) " +
          "and p.delFlag = false " +
          "and (:productSizes IS NULL OR ps IN :productSizes) " +
          "and (:colors IS NULL OR pc.text IN :colors) " +
          "and (:query IS NULL OR p.pname LIKE %:query% or p.pdesc LIKE %:query%) " + // 검색어 필터 추가
          "and (:categoryIds IS NULL OR p.adminCategory.cno IN :categoryIds) " + // categoryIds가 null이거나 비어 있을 때 처리
          "and (:minPrice IS NULL OR :maxPrice IS NULL OR p.price BETWEEN :minPrice AND :maxPrice) " + // 가격 필터 추가
          "GROUP BY p.pno")
  Page<Object[]> selectList(Pageable pageable, @Param("categoryIds") List<Long> categoryIds, @Param("colors") List<String> colors, @Param("productSizes") List<String> productSizes, @Param("minPrice") Long minPrice, @Param("maxPrice") Long maxPrice, @Param("query") String query);

  @Query("select p, pi from Product p left join p.imageList pi where (NULLIF(pi.ord, ' ') IS NULL or pi.ord = 0) and p.delFlag = false and p.owner.email = :email")
  Page<Object[]> selectAdminList(Pageable pageable, @Param("email") String email);

  @Query("SELECT p, pi, AVG(COALESCE(r.rating, 0)) as avgRating " +
          "FROM Product p " +
          "LEFT JOIN p.imageList pi " +
          "LEFT JOIN Review r ON r.product.pno = p.pno " +
          "WHERE p.pname LIKE CONCAT('%', :search, '%') " +
          "AND (NULLIF(pi.ord, ' ') IS NULL OR pi.ord = 0) " +
          "AND p.delFlag = false " +
          "AND p.owner.email = :email " +
          "GROUP BY p.pno")
  Page<Object[]> searchAdminList(Pageable pageable, @Param("search") String search, @Param("email") String email);

  @Query("SELECT p, pi, AVG(COALESCE(r.rating, 0)) as avgRating " +
          "FROM Product p " +
          "LEFT JOIN p.imageList pi " +
          "LEFT JOIN Review r ON r.product.pno = p.pno " +
          "WHERE (NULLIF(pi.ord, ' ') IS NULL OR pi.ord = 0) " +
          "AND p.delFlag = false " +
          "GROUP BY p.pno " +
          "ORDER BY p DESC")
  List<Object[]>  findNewProducts(Pageable pageable);


  @Query("SELECT p, pi, AVG(COALESCE(r.rating, 0)) as avgRating, COUNT(DISTINCT r) as reviewCount " +
          "FROM Product p " +
          "LEFT JOIN p.imageList pi " +
          "LEFT JOIN Review r ON r.product.pno = p.pno " +
          "WHERE (NULLIF(pi.ord, ' ') IS NULL OR pi.ord = 0) " +
          "AND p.delFlag = false " +
          "GROUP BY p.pno " +
          "ORDER BY p ASC")
  List<Object[]> findExpertProducts(Pageable pageable);

  @Query("SELECT p, pi, AVG(COALESCE(r.rating, 0)) as avgRating " +
          "FROM Product p " +
          "LEFT JOIN p.imageList pi " +
          "LEFT JOIN Review r ON r.product.pno = p.pno " +
          "WHERE (NULLIF(pi.ord, ' ') IS NULL OR pi.ord = 0) " +
          "AND p.delFlag = false " +
          "GROUP BY p.pno " +
          "ORDER BY p ASC")
  List<Object[]>  findFeaturedProducts(Pageable pageable);


}
