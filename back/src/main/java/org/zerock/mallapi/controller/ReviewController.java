package org.zerock.mallapi.controller;

//프론트에서 매개변수들 다 받으면, confirm 으로 api 송신 후

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.ReviewDTO;
import org.zerock.mallapi.service.ReviewService;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @PostMapping("/")
    public DataResponseDTO<String> register(@RequestBody ReviewDTO reviewDTO, Principal principal) {

        //리뷰 쓴 사람은 -> 구매를 했는지 확인 하고 ..

        String email = principal.getName();

        reviewService.register(reviewDTO, email);

        return DataResponseDTO.of("SUCCESS");

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/list/{pno}")
    public DataResponseDTO<List<ReviewDTO>> list(@PathVariable(name="pno") Long pno) {

        return DataResponseDTO.of(reviewService.getList(pno));

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/myReviews")
    public DataResponseDTO<List<ReviewDTO>> getMylist(Principal principal) {

        String email = principal.getName();
        log.info("--------------------------------------------");
        log.info("email: " + email );

        return DataResponseDTO.of(reviewService.getMyList(email));

    }


}
