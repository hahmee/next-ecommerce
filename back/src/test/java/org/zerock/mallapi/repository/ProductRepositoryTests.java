package org.zerock.mallapi.repository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZonedDateTime;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.domain.Product;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {

  @Autowired
  ProductRepository productRepository;

  @Autowired
  private MemberRepository memberRepository;

  @Test
  public void testInsert() {

    String email = "user1@aaa.com";
    Member member = memberRepository.getWithRoles(email); //멤버 정보 가져옴
    log.info("-----------------");
    log.info(member);

    for (int i = 0; i < 2; i++) {

      Product product = Product.builder()
              .pname("상품" + i)
              .price(100 * i)
              .owner(member)
              .pdesc("상품설명 " + i).brand("브랜드예시").sku(UUID.randomUUID().toString()).category("카테고리").refundPolicy("환불정책예시").changePolicy("교환정책예시").inStock(true)
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

  @Test
  public void testAdminList() {

    //org.springframework.data.domain 패키지
    Pageable pageable = PageRequest.of(0, 10, Sort.by("pno").descending());

    String email = "user0@aaa.com";

    Page<Object[]> result = productRepository.selectAdminList(pageable, email);

    //java.util
    result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));

  }


}
