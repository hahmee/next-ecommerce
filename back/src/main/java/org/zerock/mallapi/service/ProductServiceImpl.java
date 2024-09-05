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
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.ProductImage;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.dto.SearchRequestDTO;
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

  @Override
  public PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO) {

    log.info("getList..............");

    Pageable pageable = PageRequest.of( 
      pageRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로 
      pageRequestDTO.getSize(), 
      Sort.by("pno").descending());
    
    Page<Object[]>  result = productRepository.selectList(pageable);

    
    List<ProductDTO> dtoList = result.get().map(arr -> {

      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];

      ProductDTO productDTO = ProductDTO.builder()
      .pno(product.getPno())
      .pname(product.getPname())
      .pdesc(product.getPdesc())
      .price(product.getPrice())
      .build();

      String imageStr = productImage.getFileName();
      productDTO.setUploadFileNames(List.of(imageStr));

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
  public PageResponseDTO<ProductDTO> getAdminList(PageRequestDTO pageRequestDTO, UserDetails userDetails) {

    log.info("getAdminList..............");

    log.info("--------------userDetails   " + userDetails);
    //현재 접속자 이메일 넣기
    String email = userDetails.getUsername();

    log.info("--------------email      " + email);

    Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
            pageRequestDTO.getSize(),
            Sort.by("pno").descending());

    Page<Object[]> result = productRepository.selectAdminList(pageable, email); // 내 이메일 주소

    log.info("........result " + result);

    List<ProductDTO> dtoList = result.get().map(arr -> {

      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];
      log.info("productImageproductImage " + productImage); //null

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
              .build();

      if(productImage !=null ) {

        String imageNameStr = productImage.getFileName(); //null이 올 수도 있음
        String imageKeyStr = productImage.getFileKey();

        log.info("imageNameStrimageNameStr " + imageNameStr);

        log.info("imageKeyStrimageKeyStr " + imageKeyStr);

        productDTO.setUploadFileNames(List.of(imageNameStr));
        productDTO.setUploadFileKeys(List.of(imageKeyStr));
      }



//      String imageNameStr = productImage.getFileName(); //null이 올 수도 있음
//      String imageKeyStr = productImage.getFileKey();
//
//      log.info("imageNameStrimageNameStr " + imageNameStr);
//
//      log.info("imageKeyStrimageKeyStr " + imageKeyStr);
//
//      productDTO.setUploadFileNames(List.of(imageNameStr));
//      productDTO.setUploadFileKeys(List.of(imageKeyStr));


      return productDTO;

    }).collect(Collectors.toList());


    log.info("........dtoList.. " + dtoList);


    long totalCount = result.getTotalElements();

    return PageResponseDTO.<ProductDTO>withAll()
            .dtoList(dtoList)
            .totalCount(totalCount)
            .pageRequestDTO(pageRequestDTO)
            .build();
  }

  @Override
  public PageResponseDTO<ProductDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO, UserDetails userDetails) {

    log.info("getAdminList..............");

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

    Page<Object[]> result = productRepository.searchAdminList(pageable,search , email); // 내 이메일 주소

    log.info("........result " + result);

    List<ProductDTO> dtoList = result.get().map(arr -> {

      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];
      log.info("productImageproductImage " + productImage); //null

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
              .build();

      if(productImage !=null ) {

        String imageNameStr = productImage.getFileName(); //null이 올 수도 있음
        String imageKeyStr = productImage.getFileKey();

        productDTO.setUploadFileNames(List.of(imageNameStr));
        productDTO.setUploadFileKeys(List.of(imageKeyStr));
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

    Product product = Product.builder()
            .pno(productDTO.getPno())
            .pname(productDTO.getPname())
            .pdesc(productDTO.getPdesc())
            .price(productDTO.getPrice())
            .brand(productDTO.getBrand())
            .changePolicy(productDTO.getChangePolicy())
            .refundPolicy(productDTO.getRefundPolicy())
            .categoryList(productDTO.getCategoryList())
            .sku(productDTO.getSku())
            .salesStatus(productDTO.getSalesStatus())
            .owner(member)
            .build();

    //업로드 처리가 끝난 파일들의 이름 리스트 
    List<String> uploadFileNames = productDTO.getUploadFileNames();

    List<String> uploadFileKeys = productDTO.getUploadFileKeys();

    if(uploadFileNames == null){
      return product;
    }

    uploadFileNames.stream().forEach(uploadName -> {

      int index = uploadFileNames.indexOf(uploadName);
      product.addImageString(uploadName, uploadFileKeys.get(index));

//      product.addImageString(uploadName);
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

  private ProductDTO entityToDTO(Product product){

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
    .build();

    List<ProductImage> imageList = product.getImageList();
    
    if(imageList == null || imageList.size() == 0 ){
      return productDTO;
    }

    List<String> fileNameList = imageList.stream().map(productImage -> 
      productImage.getFileName()).toList();

    List<String> fileKeyList = imageList.stream().map(productImage ->
            productImage.getFileKey()).toList();

    productDTO.setUploadFileNames(fileNameList);

    productDTO.setUploadFileKeys(fileKeyList);

    return productDTO;
  }

  @Override
  public void modify(ProductDTO productDTO) {
    
    //step1 read
    Optional<Product> result = productRepository.findById(productDTO.getPno());

    Product product = result.orElseThrow();

    //change pname, pdesc, price, ...etc
    product.changeName(productDTO.getPname());
    product.changeDesc(productDTO.getPdesc());
    product.changePrice(productDTO.getPrice());
    product.changeChangePolicy(productDTO.getChangePolicy());
    product.changeRefundPolicy(productDTO.getRefundPolicy());
    product.changeSku(productDTO.getSku());
    product.changeBrand(productDTO.getBrand());
    product.changeCategoryList(productDTO.getCategoryList());
    product.changeSalesStatus(productDTO.getSalesStatus());


    //upload File -- clear first
    product.clearList();

    //이미지 처리
    List<String> uploadFileNames = productDTO.getUploadFileNames();

    List<String> uploadFileKeys = productDTO.getUploadFileKeys();

      if(uploadFileNames != null && uploadFileNames.size() > 0 ){
          uploadFileNames.stream().forEach(uploadName -> {
            int index = uploadFileNames.indexOf(uploadName);
            product.addImageString(uploadName, uploadFileKeys.get(index));
          });
      }


    productRepository.save(product);
  }

  @Override
  public void remove(Long pno) {
    
    productRepository.updateToDelete(pno, true);

  }


}
