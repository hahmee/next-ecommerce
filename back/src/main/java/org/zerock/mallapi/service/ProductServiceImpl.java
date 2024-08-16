package org.zerock.mallapi.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.ProductImage;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

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


    List<ProductDTO> dtoList = result.get().map(arr -> {

      Product product = (Product) arr[0];
      ProductImage productImage = (ProductImage) arr[1];

      ProductDTO productDTO = ProductDTO.builder()
              .pno(product.getPno())
              .pname(product.getPname())
              .pdesc(product.getPdesc())
              .price(product.getPrice())
              .refundPolicy(product.getRefundPolicy())
              .changePolicy(product.getChangePolicy())
              .sku(product.getSku())
              .brand(product.getBrand())
              .category(product.getCategory())
              .delFlag(product.isDelFlag()) // 원래 없었음
              .inStock(product.isInStock())
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
  public Long register(ProductDTO productDTO) {

    Product product = dtoToEntity(productDTO);

    Product result = productRepository.save(product);
    
    return result.getPno();
  }

  private Product dtoToEntity(ProductDTO productDTO){

    Product product = Product.builder()
    .pno(productDTO.getPno())
    .pname(productDTO.getPname())
    .pdesc(productDTO.getPdesc())
    .price(productDTO.getPrice())
    .build();

    //업로드 처리가 끝난 파일들의 이름 리스트 
    List<String> uploadFileNames = productDTO.getUploadFileNames();

    if(uploadFileNames == null){
      return product;
    }

    uploadFileNames.stream().forEach(uploadName -> {
    
      product.addImageString(uploadName);
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
    .build();

    List<ProductImage> imageList = product.getImageList();
    
    if(imageList == null || imageList.size() == 0 ){
      return productDTO;
    }

    List<String> fileNameList = imageList.stream().map(productImage -> 
      productImage.getFileName()).toList();

    productDTO.setUploadFileNames(fileNameList);

    return productDTO;
  }

  @Override
  public void modify(ProductDTO productDTO) {
    
    //step1 read
    Optional<Product> result = productRepository.findById(productDTO.getPno());

    Product product = result.orElseThrow();

    //change pname, pdesc, price
    product.changeName(productDTO.getPname());
    product.changeDesc(productDTO.getPdesc());
    product.changePrice(productDTO.getPrice());

    //upload File -- clear first
    product.clearList();

    //이미지 처리
    List<String> uploadFileNames = productDTO.getUploadFileNames();

    if(uploadFileNames != null && uploadFileNames.size() > 0 ){
      uploadFileNames.stream().forEach(uploadName -> {
        product.addImageString(uploadName);
      });
    }
    productRepository.save(product);
  }

  @Override
  public void remove(Long pno) {
    
    productRepository.updateToDelete(pno, true);

  }


}
