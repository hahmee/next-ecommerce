package org.zerock.mallapi.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.*;

@Transactional
public interface ProductService {

  PageResponseDTO<ProductDTO> getList(PageCategoryRequestDTO pageCategoryRequestDTO);

  PageResponseDTO<ProductDTO> getAdminList(PageRequestDTO pageRequestDTO, UserDetails userDetails);

  PageResponseDTO<ProductDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO, UserDetails userDetails);

  Long register(ProductDTO productDTO, UserDetails userDetails);

  ProductDTO get(Long pno);

  void modify(ProductDTO productDTO);

  void remove(Long pno);

}
