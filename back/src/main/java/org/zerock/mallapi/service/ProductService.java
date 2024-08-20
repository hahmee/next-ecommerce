package org.zerock.mallapi.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;

@Transactional
public interface ProductService {

  PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO);

  PageResponseDTO<ProductDTO> getAdminList(PageRequestDTO pageRequestDTO, UserDetails userDetails);

  Long register(ProductDTO productDTO, UserDetails userDetails);

  ProductDTO get(Long pno);

  void modify(ProductDTO productDTO);

  void remove(Long pno);

}
