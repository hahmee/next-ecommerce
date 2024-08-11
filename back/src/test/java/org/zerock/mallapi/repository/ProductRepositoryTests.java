package org.zerock.mallapi.repository;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Product;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {

  @Autowired
  ProductRepository productRepository;
  
  @Test
  public void testInsert() {

    for (int i = 0; i < 30; i++) {

      Product product = Product.builder()
      .pname("상품"+i)
      .price(100*i)
      .pdesc("상품설명 " + i)
      .build();
      
      //2개의 이미지 파일 추가 
      product.addImageString("IMAGE1.jpg");
      product.addImageString("IMAGE2.jpg");
      
      productRepository.save(product);

      log.info("-------------------");
    }
  }

  @Transactional
  @Test
  public void testRead() {

    Long pno = 1L;

    Optional<Product> result = productRepository.findById(pno);

    Product product = result.orElseThrow();

    log.info(product); // --------- 1
    log.info(product.getImageList()); // ---------------------2

  }

  @Test
  public void testRead2() {

    Long pno = 1L;

    Optional<Product> result = productRepository.selectOne(pno);

    Product product = result.orElseThrow();

    log.info(product);
    log.info(product.getImageList());
    
  }

  @Commit
  @Transactional
  @Test
  public void testDelte() {

    Long pno = 2L;

    productRepository.updateToDelete(pno, true);

  }

  @Test
  public void testUpdate(){

    Long pno = 10L;

    Product product = productRepository.selectOne(pno).get();

    product.changeName("10번 상품");
    product.changeDesc("10번 상품 설명입니다.");
    product.changePrice(5000);

    //첨부파일 수정 
    product.clearList();

    product.addImageString(UUID.randomUUID().toString()+"_"+"NEWIMAGE1.jpg");
    product.addImageString(UUID.randomUUID().toString()+"_"+"NEWIMAGE2.jpg");
    product.addImageString(UUID.randomUUID().toString()+"_"+"NEWIMAGE3.jpg");

    productRepository.save(product);

  }

  @Test
  public void testList() {

    //org.springframework.data.domain 패키지
    Pageable pageable = PageRequest.of(0, 10, Sort.by("pno").descending());

    Page<Object[]> result = productRepository.selectList(pageable);

    //java.util
    result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));

  }



}
