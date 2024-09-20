package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.CategoryClosure;
import org.zerock.mallapi.domain.CategoryClosureId;

import java.util.List;

//각 카테고리의 조상-자손 관계를 관리하는 테이블에 대한 CRUD
public interface CategoryClosureRepository extends JpaRepository<CategoryClosure, CategoryClosureId> {

    //특정 카테고리의 모든 조상 찾기
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.ancestor = :ancestor")
    List<CategoryClosure> findAncestors(@Param("ancestor") AdminCategory ancestor);

    // 특정 카테고리의 모든 후손 찾기
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.descendant = :descendant")
    List<CategoryClosure> findDescendants(@Param("descendant") AdminCategory descendant);

}
