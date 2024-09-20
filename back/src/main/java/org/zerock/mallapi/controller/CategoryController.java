package org.zerock.mallapi.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.CategoryService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/categories")
public class CategoryController {

  private final CategoryService categoryService;

  @PreAuthorize("hasAnyRole('ROLE_ADMIN')") //임시로 권한 설정
  @PostMapping("/")
  public DataResponseDTO<Long> register(@Valid CategoryDTO categoryDTO) {

    log.info("register: ?????????????" + categoryDTO);


    //서비스 호출 
    Long pno = categoryService.addCategory(categoryDTO);

    return DataResponseDTO.of(pno);
  }





}
