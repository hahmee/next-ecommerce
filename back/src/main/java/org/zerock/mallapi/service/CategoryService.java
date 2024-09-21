package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.CategoryDTO;

import java.util.List;

@Transactional
public interface CategoryService {

  Long addCategory(CategoryDTO categoryDTO);

  List<CategoryDTO> getAllCategories();

}
