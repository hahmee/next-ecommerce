package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.SearchRequestDTO;

import java.util.List;

@Transactional
public interface CategoryService {

  CategoryDTO addCategory(CategoryDTO categoryDTO);

  PageResponseDTO<CategoryDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO);

  List<CategoryDTO> getAllCategories();

  List<CategoryDTO> getAllCategoryPaths(Long cno);

  CategoryDTO get(Long cno);

  void modify(CategoryDTO categoryDTO);

  List<Long> remove(Long cno);
}
