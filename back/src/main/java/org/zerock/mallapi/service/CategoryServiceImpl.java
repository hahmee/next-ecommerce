package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.repository.CategoryClosureRepository;
import org.zerock.mallapi.repository.CategoryRepository;
import org.zerock.mallapi.util.GeneralException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

  private final CategoryRepository categoryRepository;
  private final CategoryClosureRepository categoryClosureRepository;


  // 카테고리 및 자식 카테고리들 조회 및 변환 로직
  public CategoryDTO convertToDTO(AdminCategory category) {

    // 해당 카테고리의 바로 밑 자식 카테고리들 찾기
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
            .uploadFileName(category.getImage() != null ? category.getImage().getFileName() : null)
            .uploadFileKey(category.getImage() != null ? category.getImage().getFileKey() : null)
            .subCategories(subCategories.isEmpty() ? null : subCategories.stream().map(this::convertToDTO).collect(Collectors.toList())) // 자식 있으면 재귀 호출
            .build();
  }

  // 모든 카테고리 다 가져오기
  @Override
  public PageResponseDTO<CategoryTreeDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO) {

    Pageable pageable = PageRequest.of(
            searchRequestDTO.getPage() - 1,  // 페이지 시작 0
            searchRequestDTO.getSize(),
            Sort.by("cno").descending());

    String search = searchRequestDTO.getSearch();

    // 1) 검색 결과: 루트 노드만 페이징 조회
    Page<AdminCategory> page = categoryRepository.searchAdminList(pageable, search);

    //  이번 페이지의 루트 ID들
    List<Long> ancestorIds = page.getContent().stream()
            .map(AdminCategory::getCno)
            .toList();

    //빈 페이지라면 바로 빈 결과 리턴
    if (ancestorIds.isEmpty()) {
      PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
              .page(searchRequestDTO.getPage())
              .size(searchRequestDTO.getSize())
              .build();

      return PageResponseDTO.<CategoryTreeDTO>withAll()
              .dtoList(Collections.emptyList())
              .totalCount(page.getTotalElements())
              .pageRequestDTO(pageRequestDTO)
              .build();
    }

    // 2) 루트 → 모든 후손 관계(깊이 상관없이 전부) 조회
    List<CategoryClosure> relationsFromRoots = categoryClosureRepository.findByIdAncestorCnoIn(ancestorIds);

    // 방금 모은 관계에서 등장하는 모든 노드의 ID를 뽑아 allIds
    Set<Long> allIds = relationsFromRoots.stream()
            .map(cc -> cc.getId().getDescendant().getCno())
            .collect(Collectors.toSet());
    allIds.addAll(ancestorIds);

    log.info("allIds" + allIds); // [1, 2, 3, 5, 6, 7, 8]

    // 실제 노드 엔티티 한 번에 로드 → DTO 맵 구성
    List<AdminCategory> nodes = categoryRepository.findByCnoIn(allIds);

    // 부모–자식 연결을 빠르게 하려고 map 생성
    // 키: 카테고리의 고유 id, 값: 그 id에 해당하는 노드 객체
    // 트리구조 만들기 위해
    /**
     * map 초기 구조
     * {
     *   1: { "cno": 1, "cname": "전자제품", "subCategories": [] },
     *   2: { "cno": 2, "cname": "노트북", "subCategories": [] },
     * ....
     */
    Map<Long, CategoryTreeDTO> map = new HashMap<>(nodes.size());
    for (AdminCategory c : nodes) {
      String fileKey = c.getImage() != null ? c.getImage().getFileKey() : null;
      String fileName = c.getImage() != null ? c.getImage().getFileName() : null;

      map.put(
              c.getCno(),
              new CategoryTreeDTO(
                      c.getCno(),
                      c.getCname(),
                      c.getCdesc(),
                      c.isDelFlag(),
                      fileKey,
                      fileName
              )
      );
    }


    // 3) 전체 트리 연결: edges = 부모–자식 연결선 목록
    //    edges = "부모–자식 연결선 목록"
    //    allIds에 들어있는 노드들을 조상으로 보고, depth = 1(= 직계)인 관계만 전부 모아놓은 리스트
    //    allIds(이번 페이지에서 다룰 모든 노드)를 "조상"으로 하는 depth=1 엣지를 전부 가져온다.
    //    edges = {(A,B), (B,C), (C,D)}
    List<CategoryClosure> edges = categoryClosureRepository.findByIdAncestorCnoInAndDepth(new ArrayList<>(allIds), 1);

    //  부모–자식 연결을 한 번에 구성 (O(E))
    for (CategoryClosure e : edges) { // edge 돌면서 연결하기
      Long parentId = e.getId().getAncestor().getCno();
      Long childId  = e.getId().getDescendant().getCno();

      CategoryTreeDTO parent = map.get(parentId);
      CategoryTreeDTO child  = map.get(childId);

      if (parent != null && child != null) {
        parent.getSubCategories().add(child); // 부모 노드의 children 배열에 자식 노드 넣기
      }
    }

    log.info("map..."+ map);

     // 형제 정렬
    /**
     *{
     *   1: {
     *     "cno": 1,
     *     "cname": "전자제품",
     *     "subCategories": [
     *       {
     *         "cno": 2,
     *         ....
     *
     *
     */
     map.values().forEach(n ->
         n.getSubCategories().sort(Comparator.comparing(CategoryTreeDTO::getCno))
     );


    // 4) 최종 루트만 반환
    //    이번 페이지의 루트 집합 중, "부모가 있는(=누군가의 자식인)" 후보를 제거
    Set<Long> hasParent = edges.stream()
            .map(e -> e.getId().getDescendant().getCno())
            .collect(Collectors.toSet());

    // map에서 루트를 찾는다.
    List<CategoryTreeDTO> roots = ancestorIds.stream()
            .filter(id -> !hasParent.contains(id)) // 같은 페이지 안에서 우발적으로 자식으로 붙은 경우 방지
            .map(map::get)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());


    PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
            .page(searchRequestDTO.getPage())
            .size(searchRequestDTO.getSize())
            .build();

    return PageResponseDTO.<CategoryTreeDTO>withAll()
            .dtoList(roots)
            .totalCount(page.getTotalElements())
            .pageRequestDTO(pageRequestDTO)
            .build();
  }


  @Override
  public List<CategoryDTO> getAllCategories() {

    List<AdminCategory> categories = categoryRepository.findRootCategories();

    //여기에서 subCategory있으면 넣어주기
    List<CategoryDTO> responseDTO = categories.stream().map(this::convertToDTO).collect(Collectors.toList());


    return responseDTO;
  }

  @Override
  public CategoryDTO get(Long cno) {
    Optional<AdminCategory> result = categoryRepository.selectOne(cno);

    AdminCategory category = result.orElseThrow(
            () -> new GeneralException(ErrorCode.NOT_FOUND, "카테고리를 찾을 수 없습니다. cno=" + cno)
    );


    CategoryDTO categoryDTO = convertToDTO(category);

    //부모 카테고리 id 찾기
    Optional<CategoryClosure> parentClosure = categoryClosureRepository.findParentByDescendantId(cno);


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

    AdminCategory adminCategory = result.orElseThrow(
            () -> new GeneralException(ErrorCode.NOT_FOUND, "카테고리를 찾을 수 없습니다.")
    );

    List<CategoryClosure> ancestors = categoryClosureRepository.findAncestorsDesc(adminCategory);


    List<CategoryDTO> categoryPaths = ancestors.stream()
            .map(ancestor -> {
              AdminCategory ancestorCategory = ancestor.getId().getAncestor();
              CategoryDTO ancestorCategoryDTO =  convertToDTO(ancestorCategory);
              return ancestorCategoryDTO;
            })
            .collect(Collectors.toList());



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


    //step1 read
    Optional<AdminCategory> result = categoryRepository.findById(categoryDTO.getCno());

    AdminCategory adminCategory = result.orElseThrow(
            () -> new GeneralException(ErrorCode.NOT_FOUND, "카테고리를 찾을 수 없습니다.")
    );


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


    // 새로운 카테고리 생성
    AdminCategory newCategory = dtoToEntity(categoryDTO);
    //시간
    newCategory.setCreatedAt(LocalDateTime.now());
    newCategory.setUpdatedAt(LocalDateTime.now());


    // DB에 카테고리 저장
    AdminCategory adminCategory = categoryRepository.save(newCategory);

    //부모 카테고리
    AdminCategory parentCategory = null;

    if(categoryDTO.getParentCategoryId() != null) {
      Long parentId = categoryDTO.getParentCategoryId();

      //부모 카테고리 데이터 조회
      java.util.Optional<AdminCategory> result = categoryRepository.selectOne(parentId);

      parentCategory = result.orElseThrow(
              () -> new GeneralException(ErrorCode.NOT_FOUND, "카테고리를 찾을 수 없습니다.")
      );


    }

    // 새로운 카테고리의 트리 관계 설정
    if(parentCategory != null) {
      // 부모 카테고리와의 관계를 설정
      List<CategoryClosure> parentClosures = categoryClosureRepository.findAncestors(parentCategory);

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
    CategoryClosure selfClosure = CategoryClosure.builder()
            .id(selfClosureId)
            .depth(0) // 자기 자신이므로 깊이 0
            .build();


    categoryClosureRepository.save(selfClosure);

    CategoryDTO result = entityToDTO(adminCategory);

    result.setParentCategoryId(categoryDTO.getParentCategoryId());
    result.setSubCategories(categoryDTO.getSubCategories());

    return result;

  }

  @Override
  public List<Long> remove(Long cno) {

    List<Long> removedList = new ArrayList<>();

    //cno로 해당하는 AdminCategory찾기
    //step1 read
    Optional<AdminCategory> result = categoryRepository.findById(cno);

    AdminCategory adminCategory = result.orElseThrow(
            () -> new GeneralException(ErrorCode.NOT_FOUND, "카테고리를 찾을 수 없습니다.")
    );


    //만약, 자식이 있다면 해당하는 모든 자식들까지 true로 만들기
    List<CategoryClosure> descendants =  findDescendants(adminCategory);


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

