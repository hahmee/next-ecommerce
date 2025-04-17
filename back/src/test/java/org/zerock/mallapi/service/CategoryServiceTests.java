//package org.zerock.mallapi.service;
//
//import lombok.extern.log4j.Log4j2;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.zerock.mallapi.dto.CategoryDTO;
//import org.zerock.mallapi.dto.PageRequestDTO;
//import org.zerock.mallapi.dto.PageResponseDTO;
//import org.zerock.mallapi.dto.ProductDTO;
//
//import java.util.List;
//import java.util.UUID;
//
//@SpringBootTest
//@Log4j2
//public class CategoryServiceTests {
//
//  @Autowired
//  CategoryService categoryService;
//
//  @Test
//  public void testGetAll() {
//
//    log.info("----");
//    List<CategoryDTO> result = categoryService.getAllCategories();
//
//    log.info("===" + result);
//    result.forEach(dto -> log.info(dto));
//
//  }
//
//
//  @Test
//  public void testRegister() {
//
//    //    CategoryDTO categoryDTO = CategoryDTO.builder().cname("이름예시").cdesc("설명예시").build();
//
//
//    //실제 존재하는 번호로 테스트 (부모 카테고리 번호)
//    Long cno = 15L;
//
//    CategoryDTO parentCategory = CategoryDTO.builder().cno(cno).build();
//    CategoryDTO categoryDTO = CategoryDTO.builder().cname("이름예시5").cdesc("설명예시5").parentCategory(parentCategory).build();
//
//
//    categoryService.addCategory(categoryDTO);
//
//  }
//
//}
