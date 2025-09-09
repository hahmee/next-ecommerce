package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.CategoryClosure;
import org.zerock.mallapi.domain.CategoryClosureId;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

//각 카테고리의 조상-자손 관계를 관리하는 테이블에 대한 CRUD
public interface CategoryClosureRepository extends JpaRepository<CategoryClosure, CategoryClosureId> {


    // 조상 cno가 목록에 있고, depth가 주어진 값인 관계 전부
    List<CategoryClosure> findByIdAncestorCnoInAndDepth(
            Collection<Long> ancestorCnos,
            int depth
    );

    // 조상 ID 목록에 포함된 모든 관계를 가져오는 메서드
    List<CategoryClosure> findByIdAncestorCnoIn(List<Long> ancestorCnos);

    // 자식 cno로 부모 카테고리 찾기
    @Query("SELECT cc FROM CategoryClosure cc WHERE cc.id.descendant.cno = :cno AND cc.depth = 1")
    Optional<CategoryClosure> findParentByDescendantId(@Param("cno") Long cno);


    // 부모 카테고리 찾기
    @Query("SELECT cc FROM CategoryClosure cc WHERE cc.id.descendant = :descendant AND cc.depth = 1")
    Optional<CategoryClosure> findAncestorByDescendant(@Param("descendant") AdminCategory descendant);

    // 바로 밑 자식 카테고리들 찾기
    @Query("SELECT cc FROM CategoryClosure cc WHERE cc.id.ancestor = :ancestor AND cc.depth = 1 and cc.id.descendant.delFlag = false")
    List<CategoryClosure> findDescendantsByAncestor(@Param("ancestor") AdminCategory ancestor);

    //특정 카테고리의 모든 조상 찾기
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.descendant = :adminCategory ORDER BY c.depth ASC")
    List<CategoryClosure> findAncestors(@Param("adminCategory") AdminCategory adminCategory);

    //특정 카테고리의 모든 조상 찾기 - 역순
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.descendant = :adminCategory ORDER BY c.depth DESC")
    List<CategoryClosure> findAncestorsDesc(@Param("adminCategory") AdminCategory adminCategory);

    // 특정 카테고리의 모든 후손 찾기 (depth 1,2,3...)
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.ancestor = :adminCategory and c.depth !=0")
    List<CategoryClosure> findDescendants(@Param("adminCategory") AdminCategory adminCategory);

    // 특정 카테고리의 모든 후손 찾기 (depth 1,2,3...)
    @Query("SELECT c FROM CategoryClosure c WHERE c.id.ancestor = :adminCategory")
    List<CategoryClosure> findDescendantsAndMe(@Param("adminCategory") AdminCategory adminCategory);

}
