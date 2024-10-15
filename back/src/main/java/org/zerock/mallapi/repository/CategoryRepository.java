package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.Product;

import java.util.List;
import java.util.Optional;

// 카테고리의 정보를 저장하는 테이블에 대한 CRUD
public interface CategoryRepository extends JpaRepository<AdminCategory, Long> {

    @Query("SELECT DISTINCT c FROM AdminCategory c " +
            "JOIN CategoryClosure cc ON cc.id.descendant = c")
    List<AdminCategory> findAllCategories();

    @Query("SELECT c FROM AdminCategory c " +
            "JOIN CategoryClosure cc ON cc.id.descendant = c")
    List<AdminCategory> findAllCategoriesByTree();

    @Query("SELECT c FROM AdminCategory c WHERE (c.cname like concat('%', :search, '%') or c.cdesc like concat('%', :search, '%')) and c.cno NOT IN (SELECT cc.id.descendant.cno FROM CategoryClosure cc WHERE cc.depth = 1) and c.delFlag = false")
    Page<AdminCategory> searchAdminList(Pageable pageable, @Param("search") String search);


    @Query("SELECT c FROM AdminCategory c WHERE c.cno NOT IN (SELECT cc.id.descendant.cno FROM CategoryClosure cc WHERE cc.depth = 1) AND c.delFlag = false")
    List<AdminCategory> findRootCategories();


    @Query("select c from AdminCategory c where c.cno = :cno and c.delFlag = false")
    Optional<AdminCategory> selectOne(@Param("cno") Long cno);


    @Modifying
    @Query("update AdminCategory c set c.delFlag = :flag where c.cno = :cno")
    void updateToDelete(@Param("cno") Long cno , @Param("flag") boolean flag);


}
