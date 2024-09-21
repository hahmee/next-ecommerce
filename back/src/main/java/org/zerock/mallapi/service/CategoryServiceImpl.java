package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.CategoryClosure;
import org.zerock.mallapi.domain.CategoryClosureId;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.TodoDTO;
import org.zerock.mallapi.repository.CategoryClosureRepository;
import org.zerock.mallapi.repository.CategoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

  private final CategoryRepository categoryRepository;
  private final CategoryClosureRepository categoryClosureRepository;

  // 카테고리 및 자식 카테고리들 조회 및 변환 로직
  public CategoryDTO convertToDTO(AdminCategory category) {

    // 해당 카테고리의 자식 카테고리들 찾기
    List<AdminCategory> subCategories = categoryClosureRepository
            .findDescendantsByAncestor(category)
            .stream()
            .map(closure -> closure.getId().getDescendant())
            .collect(Collectors.toList());

    // 카테고리 DTO 변환
    return CategoryDTO.builder()
            .cno(category.getCno())
            .cname(category.getCname())
            .cdesc(category.getCdesc())
            .delFlag(category.isDelFlag())
            .subCategories(subCategories.isEmpty() ? null : subCategories.stream().map(this::convertToDTO).collect(Collectors.toList()))
            .build();
  }
  //모든 카테고리 다 가져오기
  @Override
  public List<CategoryDTO> getAllCategories() {


    List<AdminCategory> categories = categoryRepository.findRootCategories();

    log.info("===============categories "  + categories);

    //여기에서 subCategory있으면 넣어주기
    List<CategoryDTO> responseDTO = categories.stream().map(this::convertToDTO).collect(Collectors.toList());

    log.info("===============responseDTO "  + responseDTO);

    return responseDTO;

  }

  //부모 카테고리에 카테고리 추가
  @Override
  public Long addCategory(CategoryDTO categoryDTO) {

    log.info("=================categoryDTO " + categoryDTO);

    // 새로운 카테고리 생성
    AdminCategory newCategory = dtoToEntity(categoryDTO);
    //시간
    newCategory.setCreatedAt(LocalDateTime.now());
    newCategory.setUpdatedAt(LocalDateTime.now());

    log.info("=================newCategory " + newCategory.getUpdatedAt());
    log.info("=================newCategory " + newCategory.getCreatedAt());


    // DB에 카테고리 저장
    categoryRepository.save(newCategory);

    //부모 카테고리
    AdminCategory parentCategory = null;

    if(categoryDTO.getParentCategory() != null) {
      parentCategory = dtoToEntity(categoryDTO.getParentCategory());

    }

    // 새로운 카테고리의 트리 관계 설정
    if(parentCategory != null) {
      // 부모 카테고리와의 관계를 설정
      List<CategoryClosure> parentClosures = categoryClosureRepository.findAncestors(parentCategory);

      log.info("==parentClosures" + parentClosures);

      for (CategoryClosure parentClosure : parentClosures) {
        // 부모-조상 관계 복사 (부모의 모든 조상과 연결)
        CategoryClosureId closureId = CategoryClosureId.builder()
                .ancestor(parentClosure.getId().getAncestor())
                .descendant(newCategory)
                .build();

        CategoryClosure closure = CategoryClosure.builder()
                .id(closureId)
                .depth(parentClosure.getDepth() + 1) // 부모의 깊이에 1 추가
                .build();

        categoryClosureRepository.save(closure);
      }

      // 부모와 자신과의 직접적인 관계 추가
      CategoryClosureId closureId = CategoryClosureId.builder()
              .ancestor(parentCategory)
              .descendant(newCategory)
              .build();

      CategoryClosure closure = CategoryClosure.builder()
              .id(closureId)
              .depth(1) // 부모와 자식의 깊이 1
              .build();

      categoryClosureRepository.save(closure);

    }


    // 자기 자신과의 관계 설정 (깊이 0)
    CategoryClosureId selfClosureId = CategoryClosureId.builder().ancestor(newCategory).descendant(newCategory).build();
    log.info("selfClosureId========== " + selfClosureId);
    CategoryClosure selfClosure = CategoryClosure.builder()
            .id(selfClosureId)
            .depth(0) // 자기 자신이므로 깊이 0
            .build();

    log.info("selfClosure========== " + selfClosure);

    categoryClosureRepository.save(selfClosure);

    return newCategory.getCno();

  }


  public List<CategoryClosure> findAncestors(AdminCategory category) {
    return categoryClosureRepository.findAncestors(category);
  }

  public List<CategoryClosure> findDescendants(AdminCategory category) {
    return categoryClosureRepository.findDescendants(category);
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

