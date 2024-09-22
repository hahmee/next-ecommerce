package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.ProductDTO;

import java.util.List;

@Transactional
public interface CategoryService {

  Long addCategory(CategoryDTO categoryDTO);

  List<CategoryDTO> getAllCategories();

  CategoryDTO get(Long cno);

  void modify(CategoryDTO categoryDTO);

  void remove(Long cno);
}
