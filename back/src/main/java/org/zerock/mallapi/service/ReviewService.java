package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.ReviewDTO;

@Transactional
public interface ReviewService {

  void register(ReviewDTO reviewDTO, String email);

}
