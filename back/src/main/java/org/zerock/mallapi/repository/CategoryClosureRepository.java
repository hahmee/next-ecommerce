package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.CategoryClosure;
import org.zerock.mallapi.domain.CategoryClosureId;

import java.util.List;
import java.util.Optional;

//각 카테고리의 조상-자손 관계를 관리하는 테이블에 대한 CRUD
public interface CategoryClosureRepository extends JpaRepository<CategoryClosure, CategoryClosureId> {

    // 부모 카테고리 찾기
    @Query("SELECT cc FROM CategoryClosure cc WHERE cc.id.descendant = :descendant AND cc.depth = 1")
    Optional<CategoryClosure> findAncestorByDescendant(@Param("descendant") AdminCategory descendant);

    // 자식 카테고리들 찾기
    @Query("SELECT cc FROM CategoryClosure cc WHERE cc.id.ancestor = :ancestor AND cc.depth = 1")
    List<CategoryClosure> findDescendantsByAncestor(@Param("ancestor") AdminCategory ancestor);

    //특정 카테고리의 모든 조상 찾기
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.descendant = :descendant ORDER BY c.depth ASC")
    List<CategoryClosure> findAncestors(@Param("descendant") AdminCategory descendant);


    // 특정 카테고리의 모든 후손 찾기
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.descendant = :descendant")
    List<CategoryClosure> findDescendants(@Param("descendant") AdminCategory descendant);

}
