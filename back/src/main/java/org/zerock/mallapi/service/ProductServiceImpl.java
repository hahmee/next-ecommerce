package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.CategoryClosureRepository;
import org.zerock.mallapi.repository.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService{

  private final ProductRepository productRepository;

  private final CategoryClosureRepository categoryClosureRepository;

  private final MemberService memberService;


  @Override
  public PageResponseDTO<ProductDTO> getList(PageCategoryRequestDTO pageCategoryRequestDTO) {

    log.info("getList.............." + pageCategoryRequestDTO);


    // 정렬 순서를 동적으로 결정
    Sort sort = Sort.by("pno").descending();  // 기본 정렬은 pno로 내림차순

    if (pageCategoryRequestDTO.getOrder() != null) {
      switch (pageCategoryRequestDTO.getOrder()) {
        case "high-price":
          sort = Sort.by("price").descending();  // 가격 높은 순
          break;
        case "low-price":
          sort = Sort.by("price").ascending();   // 가격 낮은 순
          break;
        case "newest":
          sort = Sort.by("createdAt").descending();  // 최신 순
          break;
        case "sales":

          log.info("slae..s...");
          sort = Sort.by(Sort.Order.desc("salesCount"));  // 판매개수 많은 순
          break;
        case "ratings":
          sort = Sort.by(Sort.Order.desc("avgRating"));  // 평균 별점 높은 순
          break;
        case "review":
          //리뷰 개수 많은대로..
          sort = Sort.by(Sort.Order.desc("reviewCount"));  // 리뷰 개수 많은 순
          break;
        default:
          // 기본은 pno로 내림차순
          break;
      }
    }

    Pageable pageable = PageRequest.of(
            pageCategoryRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            pageCategoryRequestDTO.getSize(),
            sort
//      Sort.by("pno").descending()
    );


    List<Long> categoryClosureAncestorIds = null;

    //getCategoryId가 없을때 ex search 검색
    if(pageCategoryRequestDTO.getCategoryId() != null) {

      AdminCategory adminCategory = AdminCategory.builder().cno(pageCategoryRequestDTO.getCategoryId()).build();
      log.info("adminCategory..///....." + adminCategory);
      List<CategoryClosure> categoryClosures = categoryClosureRepository.findDescendantsAndMe(adminCategory);

      log.info("categoryClosures..." + categoryClosures);


      categoryClosureAncestorIds = categoryClosures.stream()
              .map(categoryClosure -> categoryClosure.getId().getDescendant().getCno())  // ancestor의 id(Cno) 추출
              .collect(Collectors.toList());  // 리스트로 수집

    }

    log.info("categoryClosureIds: " + categoryClosureAncestorIds);

    // color와 productSize 필터링 처리
    List<String> colors = pageCategoryRequestDTO.getColor();
    List<String> productSizes = pageCategoryRequestDTO.getProductSize();
    Long minPrice = pageCategoryRequestDTO.getMinPrice();
    Long maxPrice = pageCategoryRequestDTO.getMaxPrice();
    String query = pageCategoryRequestDTO.getQuery();

    log.info("query... " + query);
    log.info("productSizes... " + productSizes);

//    Optional<Page<Object[]>> resultOptional = Optional.ofNullable(productRepository.selectList(pageable, categoryClosureAncestorIds, colors, productSizes, minPrice, maxPrice, query));
//
//    Page<Object[]> result = resultOptional.orElseThrow();


    Page<Object[]> result = productRepository.selectList(pageable, categoryClosureAncestorIds, colors, productSizes,minPrice,maxPrice,query);


    List<ProductDTO> dtoList = result.get().map(arr -> {



      Product product = (Product) arr[0];

      ProductImage productImage = (ProductImage) arr[1];

      Double averageRating = (Double) arr[2];  // 평균 별점

      Long reviewCount = (Long) arr[3];        // 리뷰 개수

      List<ColorTag> colorTagList = product.getColorList();

      //colorTagList를 DTO로 변경하기
      List<ColorTagDTO> colorTagDTOList =  colorTagList.stream().map(colorTag -> ColorTagDTO.builder()
              .id(colorTag.getId())
              .text(colorTag.getText())
              .color(colorTag.getColor())
              .build())
              .collect(Collectors.toList());

      //owner을 DTO로 변경하기
      MemberDTO memberDTO = memberService.entityToDTO(product.getOwner());

      ProductDTO productDTO = ProductDTO.builder()
              .pno(product.getPno())
              .pname(product.getPname())
              .pdesc(product.getPdesc())
              .price(product.getPrice())
              .refundPolicy(product.getRefundPolicy())
              .changePolicy(product.getChangePolicy())
              .sku(product.getSku())
              .brand(product.getBrand())
              .categoryList(product.getCategoryList())
              .delFlag(product.isDelFlag()) // 원래 없었음
              .salesStatus(product.getSalesStatus())
              .colorList(colorTagDTOList)
              .sizeList(product.getSizeList())
              .averageRating(averageRating)
              .reviewCount(reviewCount)
              .owner(memberDTO)
              .build();

      if(productImage != null) {

        String imageNameStr = productImage.getFileName();
        String imageKeyStr = productImage.getFileKey();


        FileDTO<String> uploadFileName = new FileDTO<>();
        uploadFileName.setFile(imageNameStr);

        FileDTO<String> uploadFileKey = new FileDTO<>();
        uploadFileKey.setFile(imageKeyStr);


        productDTO.setUploadFileNames(List.of(uploadFileName));
        productDTO.setUploadFileKeys(List.of(uploadFileKey));

      }

      return productDTO;

    }).collect(Collectors.toList());

    log.info("-------dtoList " + dtoList);
    
    long totalCount = result.getTotalElements();

    log.info("??... " + pageable);

    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(pageCategoryRequestDTO.getPage()).size(pageCategoryRequestDTO.getSize()).build();


    return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
  }

  @Override
  public PageResponseDTO<ProductDTO> getAdminList(PageRequestDTO pageRequestDTO, UserDetails userDetails) {

    log.info("pageRequestDTO...." + pageRequestDTO);
    //현재 접속자 이메일 넣기
    String email = userDetails.getUsername();


    Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            pageRequestDTO.getSize(),
            Sort.by("pno").descending());

    Page<Object[]> result = productRepository.selectAdminList(pageable, email); // 내 이메일 주소


    List<ProductDTO> dtoList = result.get().map(arr -> {

      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];

      MemberDTO memberDTO = memberService.entityToDTO(product.getOwner());


      ProductDTO productDTO = ProductDTO.builder()
              .pno(product.getPno())
              .pname(product.getPname())
              .pdesc(product.getPdesc())
              .price(product.getPrice())
              .refundPolicy(product.getRefundPolicy())
              .changePolicy(product.getChangePolicy())
              .sku(product.getSku())
              .brand(product.getBrand())
              .categoryList(product.getCategoryList())
              .delFlag(product.isDelFlag()) // 원래 없었음
              .salesStatus(product.getSalesStatus())
              .owner(memberDTO)
              .build();

      if(productImage !=null ) {

        String imageNameStr = productImage.getFileName(); //null이 올 수도 있음
        String imageKeyStr = productImage.getFileKey();


        FileDTO<String> uploadFileName = new FileDTO<>();
        uploadFileName.setFile(imageNameStr);

        FileDTO<String> uploadFileKey = new FileDTO<>();
        uploadFileKey.setFile(imageKeyStr);



        productDTO.setUploadFileNames(List.of(uploadFileName));
        productDTO.setUploadFileKeys(List.of(uploadFileKey));


      }

      return productDTO;

    }).collect(Collectors.toList());



    long totalCount = result.getTotalElements();

    return PageResponseDTO.<ProductDTO>withAll()
            .dtoList(dtoList)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();
  }

  @Override
  public PageResponseDTO<ProductDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO, UserDetails userDetails) {

    log.info("getAdminList.............." + searchRequestDTO);

    log.info("--------------userDetails   " + userDetails);

    //현재 접속자 이메일 넣기
    String email = userDetails.getUsername();

    log.info("--------------email      " + email);

    Pageable pageable = PageRequest.of(
            searchRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            searchRequestDTO.getSize(),
            Sort.by("pno").descending());

    String search = searchRequestDTO.getSearch();


    log.info("--------------pageable      " + pageable);

    Page<Object[]> result = productRepository.searchAdminList(pageable, search, email); // 내 이메일 주소

    log.info("........result " + result);

    List<ProductDTO> dtoList = result.get().map(arr -> {

      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];
      log.info("productImageproductImage " + productImage); //null

      MemberDTO memberDTO = memberService.entityToDTO(product.getOwner());

      CategoryDTO categoryDTO = CategoryDTO.builder()
              .cno(product.getAdminCategory().getCno())
              .cname(product.getAdminCategory().getCname())
              .cdesc(product.getAdminCategory().getCdesc())
              .delFlag(product.getAdminCategory().isDelFlag())
              .build();

      ProductDTO productDTO = ProductDTO.builder()
              .pno(product.getPno())
              .pname(product.getPname())
              .pdesc(product.getPdesc())
              .price(product.getPrice())
              .refundPolicy(product.getRefundPolicy())
              .changePolicy(product.getChangePolicy())
              .sku(product.getSku())
              .brand(product.getBrand())
              .categoryList(product.getCategoryList())
              .delFlag(product.isDelFlag()) // 원래 없었음
              .salesStatus(product.getSalesStatus())
              .category(categoryDTO)
              .owner(memberDTO)
              .build();

      if(productImage !=null) {

        String imageNameStr = productImage.getFileName(); //null이 올 수도 있음
        String imageKeyStr = productImage.getFileKey();

        FileDTO<String> uploadFileName = new FileDTO<>();
        uploadFileName.setFile(imageNameStr);

        FileDTO<String> uploadFileKey = new FileDTO<>();
        uploadFileKey.setFile(imageKeyStr);

        productDTO.setUploadFileNames(List.of(uploadFileName));
        productDTO.setUploadFileKeys(List.of(uploadFileKey));


      }


      return productDTO;

    }).collect(Collectors.toList());


    log.info("........dtoList.. " + dtoList);


    long totalCount = result.getTotalElements();

    PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(searchRequestDTO.getPage()).size(searchRequestDTO.getSize()).build();

    return PageResponseDTO.<ProductDTO>withAll()
            .dtoList(dtoList)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();

  }

  @Override
  public Long register(ProductDTO productDTO, UserDetails userDetails) {

    //현재 접속자 이메일 넣기
    String email = userDetails.getUsername();

    Product product = dtoToEntity(productDTO, email);

    //시간
    product.setCreatedAt(LocalDateTime.now());
    product.setUpdatedAt(LocalDateTime.now());

    Product result = productRepository.save(product);
    
    return result.getPno();
  }

  private Product dtoToEntity(ProductDTO productDTO, String email){

    Member member = Member.builder().email(email).build();

    AdminCategory category = AdminCategory.builder().cno(productDTO.getCategoryId()).build();

    Product product = Product.builder()
            .pno(productDTO.getPno())
            .pname(productDTO.getPname())
            .pdesc(productDTO.getPdesc())
            .price(productDTO.getPrice())
            .brand(productDTO.getBrand())
            .changePolicy(productDTO.getChangePolicy())
            .refundPolicy(productDTO.getRefundPolicy())
            .categoryList(productDTO.getCategoryList())
            .sizeList(productDTO.getSizeList())
            .sku(productDTO.getSku())
            .adminCategory(category)
            .salesStatus(productDTO.getSalesStatus())
            .owner(member)
            .build();


    //색상 태그 넣기
    List<ColorTagDTO> colorList = productDTO.getColorList();

    colorList.stream().forEach(color -> {
      product.addColorTag(color.getColor(), color.getText());
    });


    //업로드 처리가 끝난 파일들의 이름 리스트
    List<FileDTO<String>> uploadFileNames = productDTO.getUploadFileNames();

    List<FileDTO<String>> uploadFileKeys = productDTO.getUploadFileKeys();

    if(uploadFileNames == null){
      return product;
    }

    uploadFileNames.stream().forEach(uploadName -> {

      int index = uploadFileNames.indexOf(uploadName);
      product.addImageString(uploadName.getFile(), uploadFileKeys.get(index).getFile(), uploadName.getOrd());


    });

    return product;
  }

  @Override
  public ProductDTO get(Long pno) {
    
    java.util.Optional<Product> result = productRepository.selectOne(pno);

    Product product = result.orElseThrow();
    
    ProductDTO productDTO = entityToDTO(product);

    return productDTO;

  }

  public ProductDTO entityToDTO(Product product){

    MemberDTO memberDTO = memberService.entityToDTO(product.getOwner());

    ProductDTO productDTO = ProductDTO.builder()
    .pno(product.getPno())
    .pname(product.getPname())
    .pdesc(product.getPdesc())
    .price(product.getPrice())
            .brand(product.getBrand())
            .sku(product.getSku())
            .changePolicy(product.getChangePolicy())
            .refundPolicy(product.getRefundPolicy())
            .salesStatus(product.getSalesStatus())
            .categoryList(product.getCategoryList())
            .sizeList(product.getSizeList())
            .categoryId(product.getAdminCategory().getCno())
            .owner(memberDTO)
    .build();

    //태그
    List<ColorTag> colorTagList = product.getColorList();

    List<ColorTagDTO> colorTagDTOList = colorTagList.stream().map(colorTag -> {

      Long id = colorTag.getId();
      String text =  colorTag.getText();
      String color = colorTag.getColor();

      ColorTagDTO result = new ColorTagDTO();

      result.setId(id);
      result.setColor(color);
      result.setText(text);

      return result;
    }).toList();

    productDTO.setColorList(colorTagDTOList);


    List<ProductImage> imageList = product.getImageList();


    if(imageList == null || imageList.size() == 0 ){
      return productDTO;
    }


    List<FileDTO<String>> fileNameList = imageList.stream().map(productImage -> {

      String file = productImage.getFileName();
      int ord =  productImage.getOrd();

      FileDTO<String> result = new FileDTO<>();

      result.setFile(file);
      result.setOrd(ord);

      return result;


    }).toList();


    List<FileDTO<String>> fileKeyList = imageList.stream().map(productImage -> {

      String file = productImage.getFileKey();
      int ord =  productImage.getOrd();

      FileDTO<String> result = new FileDTO<>();
      result.setFile(file);
      result.setOrd(ord);

      return result;


    }).toList();


    productDTO.setUploadFileNames(fileNameList);

    productDTO.setUploadFileKeys(fileKeyList);


    return productDTO;
  }

  @Override
  public void modify(ProductDTO productDTO) {

    log.info("--------modify+ " + productDTO);
    
    //step1 read
    Optional<Product> result = productRepository.findById(productDTO.getPno());
    Product product = result.orElseThrow();

//    Optional<AdminCategory> adminCategoryResult = categoryRepository.findById(productDTO.getCategoryId());
//    AdminCategory adminCategory = adminCategoryResult.orElseThrow();

    AdminCategory adminCategory = AdminCategory.builder()
            .cno(productDTO.getCategoryId())
            .build();

    log.info("adminCategory...." + adminCategory);
    //change pname, pdesc, price, ...etc
    product.changeName(productDTO.getPname());
    product.changeDesc(productDTO.getPdesc());
    product.changePrice(productDTO.getPrice());
    product.changeChangePolicy(productDTO.getChangePolicy());
    product.changeRefundPolicy(productDTO.getRefundPolicy());
    product.changeSku(productDTO.getSku());
    product.changeBrand(productDTO.getBrand());
    product.changeCategoryList(productDTO.getCategoryList());
    product.changeSizeList(productDTO.getSizeList());
    product.changeSalesStatus(productDTO.getSalesStatus());
    product.changeAdminCategory(adminCategory);


    //시간도 변경
    product.setUpdatedAt(LocalDateTime.now());

    //upload File -- clear first
    product.clearColorList();

    //색상 태그 처리
    List<ColorTagDTO> colorTagList = productDTO.getColorList();

    colorTagList.stream().forEach(colorTag -> {
      product.addColorTag(colorTag.getColor(), colorTag.getText());

    });


    //upload File -- clear first
    product.clearList();

    //이미지 처리

    List<FileDTO<String>> uploadFileNames = productDTO.getUploadFileNames();

    List<FileDTO<String>> uploadFileKeys = productDTO.getUploadFileKeys();



    if (uploadFileNames != null && uploadFileNames.size() > 0) {

      uploadFileNames.stream().forEach(uploadName -> {
        int index = uploadFileNames.indexOf(uploadName);
        product.addImageString(uploadName.getFile(), uploadFileKeys.get(index).getFile(), uploadName.getOrd());

      });
    }


    productRepository.save(product);
  }

  @Override
  public void remove(Long pno) {
    
    productRepository.updateToDelete(pno, true);

  }


}
