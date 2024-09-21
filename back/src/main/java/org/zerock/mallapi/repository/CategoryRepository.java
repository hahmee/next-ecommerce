package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mallapi.domain.AdminCategory;

import java.util.List;

// 카테고리의 정보를 저장하는 테이블에 대한 CRUD
public interface CategoryRepository extends JpaRepository<AdminCategory, Long> {

    @Query("SELECT DISTINCT c FROM AdminCategory c " +
            "JOIN CategoryClosure cc ON cc.id.descendant = c")
    List<AdminCategory> findAllCategories();

    @Query("SELECT c FROM AdminCategory c " +
            "JOIN CategoryClosure cc ON cc.id.descendant = c")
    List<AdminCategory> findAllCategoriesByTree();


    @Query("SELECT c FROM AdminCategory c WHERE c.cno NOT IN (SELECT cc.id.descendant.cno FROM CategoryClosure cc WHERE cc.depth = 1)")
    List<AdminCategory> findRootCategories();




}
