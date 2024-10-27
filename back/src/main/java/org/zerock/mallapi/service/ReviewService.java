package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.ReviewDTO;

import java.util.List;

@Transactional
public interface ReviewService {

  void register(ReviewDTO reviewDTO, String email);

  List<ReviewDTO> getList(Long pno);

  List<ReviewDTO> getMyList(String email);

}
