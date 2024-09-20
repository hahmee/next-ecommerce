package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.ColorTagDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.repository.CategoryRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

  private final CategoryRepository categoryRepository;


  //부모 카테고리에 카테고리 추가
  @Override
  public Long addCategory(CategoryDTO categoryDTO) {


//    AdminCategory adminCategory = dtoToEntity(categoryDTO);
//    시간
//    adminCategory.setCreatedAt(LocalDateTime.now());
//    adminCategory.setUpdatedAt(LocalDateTime.now());

    //부모 카테고리 찾기
    AdminCategory parent = AdminCategory.builder().cno(categoryDTO.getParentId()).build();

    //자식 카테고리
    AdminCategory newCategory =  AdminCategory.builder().cno(categoryDTO.getCno()).build();



    // 새 카테고리 생성 (DB에 저장되지 않은 상태)
    CategoryClosureId newCategoryId = CategoryClosureId.builder().ancestor(parent).descendant(newCategory).build();
    CategoryClosure newCategoryClosure = CategoryClosure.builder().id(newCategoryId).depth(1).build();


    // 부모-자식 관계 추가
    List<CategoryClosure> parentRelations = categoryRepository.findAncestors(parent);
    for (CategoryClosure parentRelation : parentRelations) {

//      CategoryClosureId newRelationId = new CategoryClosureId(parentRelation.getId().getAncestor(), newCategory);
//      CategoryClosure newRelation = new CategoryClosure(newRelationId, parentRelation.getDepth() + 1);
      CategoryClosureId newRelationId = CategoryClosureId.builder().ancestor(parentRelation.getId().getAncestor()).descendant(newCategory).build();
      CategoryClosure newRelation = new CategoryClosure(newRelationId, parentRelation.getDepth() + 1);
      categoryRepository.save(newRelation);
    }



    AdminCategory result = categoryRepository.save(adminCategory);

    return result.getCno();

  }

  private AdminCategory dtoToEntity(CategoryDTO categoryDTO) {

    AdminCategory adminCategory = AdminCategory.builder()
            .cno(categoryDTO.getCno())
            .cname(categoryDTO.getCname())
            .cdesc(categoryDTO.getCdesc())
            .build();


    return adminCategory;
  }

}

