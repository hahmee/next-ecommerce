package org.zerock.mallapi.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.dto.*;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
public interface ProductService {

  PageResponseDTO<ProductDTO> getList(PageCategoryRequestDTO pageCategoryRequestDTO);

  PageResponseDTO<ProductDTO> getSearchAdminList(SearchRequestDTO searchRequestDTO, UserDetails userDetails);

  ProductDTO register(ProductDTO productDTO, UserDetails userDetails);

  ProductDTO get(Long pno);

  ProductDTO modify(ProductDTO productDTO);

  void remove(Long pno);

  ProductDTO entityToDTO(Product product);

  List<ProductDTO> getNewProducts();

  List<ProductDTO> getExpertProducts();

  List<ProductDTO> getFeaturedProducts();

  ProductDTO modifySalesStatus(StockRequestDTO stockRequestDTO);

}
