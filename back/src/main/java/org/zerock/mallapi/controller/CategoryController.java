package org.zerock.mallapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.service.CategoryService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/category")
public class CategoryController {

  private final CategoryService categoryService;

  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @PostMapping("/")
  public DataResponseDTO<Long> register(@Valid @RequestBody CategoryDTO categoryDTO) {

    log.info("register: ?????????????" + categoryDTO);


    //서비스 호출 
    Long pno = categoryService.addCategory(categoryDTO);

    return DataResponseDTO.of(pno);
  }


  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @GetMapping("/")
  public DataResponseDTO<List<CategoryDTO>> list() {
    log.info("categoryService.getAllCategories() " + categoryService.getAllCategories());
    return DataResponseDTO.of(categoryService.getAllCategories());

  }




}
