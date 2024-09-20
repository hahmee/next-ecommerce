package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.CategoryClosure;
import org.zerock.mallapi.domain.CategoryClosureId;

import java.util.List;

public interface CategoryRepository extends JpaRepository<CategoryClosure, CategoryClosureId>{


  // 특정 카테고리의 모든 후손 찾기
  List<CategoryClosure> findAncestors(AdminCategory ancestor);

  // 특정 카테고리의 모든 조상 찾기
  List<CategoryClosure> findDescendants(AdminCategory descendant);

  // 자손 ID를 기준으로 해당 카테고리의 모든 조상을 가져오는 쿼리
//  @Query("SELECT c FROM CategoryClosure c WHERE c.id.descendant = :descendant")
//  List<CategoryClosure> findAncestors(AdminCategory descendant);
//
//  // 조상 ID를 기준으로 해당 카테고리의 모든 자손을 가져오는 쿼리
//  @Query("SELECT c FROM CategoryClosure c WHERE c.id.ancestor = :ancestor")
//  List<CategoryClosure> findDescendants(AdminCategory ancestor);
}
