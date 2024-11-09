package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.CategoryClosure;
import org.zerock.mallapi.domain.CategoryClosureId;
import org.zerock.mallapi.domain.CategoryImage;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.SearchRequestDTO;
import org.zerock.mallapi.repository.CategoryClosureRepository;
import org.zerock.mallapi.repository.CategoryRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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

    //부모 카테고리 찾기


    // 카테고리 DTO 변환
    return CategoryDTO.builder()
            .cno(category.getCno())
            .cname(category.getCname())
            .cdesc(category.getCdesc())
            .delFlag(category.isDelFlag())
            .uploadFileName(category.getImage() != null ? category.getImage().getFileName() : null)
            .uploadFileKey(category.getImage() != null ? category.getImage().getFileKey() : null)
            .subCategories(subCategories.isEmpty() ? null : subCategories.stream().map(this::convertToDTO).collect(Collectors.toList()))
            .build();
  }



  //모든 카테고리 다 가져오기
  @Override
  public PageResponseDTO<CategoryDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO) {


    Pageable pageable = PageRequest.of(
            searchRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            searchRequestDTO.getSize(),
            Sort.by("cno").descending());

    String search = searchRequestDTO.getSearch();


    Page<AdminCategory> categories = categoryRepository.searchAdminList(pageable, search);

    //여기에서 subCategory있으면 넣어주기
    List<CategoryDTO> responseDTO = categories.stream().map(this::convertToDTO).collect(Collectors.toList());


    long totalCount = categories.getTotalElements();

    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(searchRequestDTO.getPage()).size(searchRequestDTO.getSize()).build();

    return PageResponseDTO.<CategoryDTO>withAll()
            .dtoList(responseDTO)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();


  }

  @Override
  public List<CategoryDTO> getAllCategories() {

    List<AdminCategory> categories = categoryRepository.findRootCategories();

    log.info("===============categories "  + categories);

    //여기에서 subCategory있으면 넣어주기
    List<CategoryDTO> responseDTO = categories.stream().map(this::convertToDTO).collect(Collectors.toList());

    log.info("===============responseDTO "  + responseDTO);



    return responseDTO;
  }

  @Override
  public CategoryDTO get(Long cno) {
    Optional<AdminCategory> result = categoryRepository.selectOne(cno);

    AdminCategory category = result.orElseThrow();

    CategoryDTO categoryDTO = convertToDTO(category);

    //부모 카테고리 id 찾기
    Optional<CategoryClosure> parentClosure = categoryClosureRepository.findParentByDescendantId(cno);

    log.info("parentClosure... " + parentClosure);

    if (parentClosure.isPresent()) { // 값이 있을 때만

      Long parentCategoryId = parentClosure.get().getId().getAncestor().getCno(); // getParentCategoryId()는 예시 메서드입니다.


      categoryDTO.setParentCategoryId(parentCategoryId);

    }



    return categoryDTO;

  }

  @Override
  public List<CategoryDTO> getAllCategoryPaths(Long cno) {

    //step1 read
    Optional<AdminCategory> result = categoryRepository.findById(cno);

    AdminCategory adminCategory = result.orElseThrow();

    List<CategoryClosure> ancestors = categoryClosureRepository.findAncestorsDesc(adminCategory);


    List<CategoryDTO> categoryPaths = ancestors.stream()
            .map(ancestor -> {
              AdminCategory ancestorCategory = ancestor.getId().getAncestor();
              CategoryDTO ancestorCategoryDTO =  convertToDTO(ancestorCategory);
              return ancestorCategoryDTO;
            })
            .collect(Collectors.toList());


    log.info("categoryPathszcategoryPathsz.... " + categoryPaths);

    return categoryPaths;

  }

  private CategoryDTO entityToDTO(AdminCategory category){

    CategoryDTO categoryDTO = CategoryDTO.builder()
            .cno(category.getCno())
            .cname(category.getCname())
            .cdesc(category.getCdesc())
            .uploadFileName(category.getImage() != null ? category.getImage().getFileName() : null)
            .uploadFileKey(category.getImage() != null ? category.getImage().getFileKey() : null)
            .build();

    return categoryDTO;
  }

  @Override
  public void modify(CategoryDTO categoryDTO) {

    log.info("=================categoryDTO " + categoryDTO);

    //step1 read
    Optional<AdminCategory> result = categoryRepository.findById(categoryDTO.getCno());

    AdminCategory adminCategory = result.orElseThrow();

    CategoryImage categoryImage = CategoryImage.builder().fileName(categoryDTO.getUploadFileName()).fileKey(categoryDTO.getUploadFileKey()).build();

    //change pname, pdesc, price, ...etc
    adminCategory.changeName(categoryDTO.getCname());
    adminCategory.changeDesc(categoryDTO.getCdesc());
    adminCategory.changeCategoryImage(categoryImage);

    //시간도 변경
    adminCategory.setUpdatedAt(LocalDateTime.now());

    categoryRepository.save(adminCategory);

  }

  //부모 카테고리에 카테고리 추가
  @Override
  public CategoryDTO addCategory(CategoryDTO categoryDTO) {

    log.info("=================categoryDTO " + categoryDTO);

    // 새로운 카테고리 생성
    AdminCategory newCategory = dtoToEntity(categoryDTO);
    //시간
    newCategory.setCreatedAt(LocalDateTime.now());
    newCategory.setUpdatedAt(LocalDateTime.now());

    log.info("=================newCategory " + newCategory.getUpdatedAt());
    log.info("=================newCategory " + newCategory.getCreatedAt());


    // DB에 카테고리 저장
    AdminCategory adminCategory = categoryRepository.save(newCategory);

    log.info("=================adminCategoryasdfkjasdl;fkja;sdlfk " + adminCategory);

    //부모 카테고리
    AdminCategory parentCategory = null;

    if(categoryDTO.getParentCategoryId() != null) {
      Long parentId = categoryDTO.getParentCategoryId();

      //부모 카테고리 데이터 조회
      java.util.Optional<AdminCategory> result = categoryRepository.selectOne(parentId);
      parentCategory = result.orElseThrow();
//      parentCategory = dtoToEntity(categoryDTO.getParentCategory());

    }

    log.info("parentCategory====== " + parentCategory);
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

    CategoryDTO result = entityToDTO(adminCategory);

    result.setParentCategoryId(categoryDTO.getParentCategoryId());
    result.setSubCategories(categoryDTO.getSubCategories());

    return result;
//    return entityToDTO(adminCategory);
//    return categoryDTO;

  }

  @Override
  public List<Long> remove(Long cno) {

    List<Long> removedList = new ArrayList<>();

    //cno로 해당하는 AdminCategory찾기
    //step1 read
    Optional<AdminCategory> result = categoryRepository.findById(cno);

    AdminCategory adminCategory = result.orElseThrow();

    //만약, 자식이 있다면 해당하는 모든 자식들까지 true로 만들기
    List<CategoryClosure> descendants =  findDescendants(adminCategory);

    log.info("=========descendants " + descendants);

    //자신 삭제
    categoryRepository.updateToDelete(cno, true);
    removedList.add(cno);

    //후손들 cno 찾아서 삭제
    for(CategoryClosure descendant: descendants) {
      Long descendantCno = descendant.getId().getDescendant().getCno();
      removedList.add(descendantCno);
      categoryRepository.updateToDelete(descendantCno, true);
    }

    return removedList;

  }


  public List<CategoryClosure> findAncestors(AdminCategory category) {
    return categoryClosureRepository.findAncestors(category);
  }

  public List<CategoryClosure> findDescendants(AdminCategory category) {
    return categoryClosureRepository.findDescendants(category);
  }

  private AdminCategory dtoToEntity(CategoryDTO categoryDTO) {

    CategoryImage categoryImage = CategoryImage.builder().fileName(categoryDTO.getUploadFileName()).fileKey(categoryDTO.getUploadFileKey()).build();

    AdminCategory adminCategory = AdminCategory.builder()
            .cno(categoryDTO.getCno())
            .cname(categoryDTO.getCname())
            .cdesc(categoryDTO.getCdesc())
            .image(categoryImage)
            .build();


    return adminCategory;
  }




}

