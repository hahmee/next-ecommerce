package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.dto.ReviewDTO;
import org.zerock.mallapi.service.ProductService;
import org.zerock.mallapi.service.ReviewService;

import java.util.List;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/public")
public class PublicApiController {

    private final ProductService productService;
    private final ReviewService reviewService;

    @GetMapping("/newProductList")
    public List<ProductDTO> getNewProducts() {
        return productService.getNewProducts();
    }

    @GetMapping("/products/{pno}")
    public DataResponseDTO<ProductDTO> read(@PathVariable(name="pno") Long pno) {
        log.info("????");

        try {
            Thread.sleep(0);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        ProductDTO productDTO = productService.get(pno);

        log.info("d...." + productDTO);
        return DataResponseDTO.of(productDTO);
    }

    @GetMapping("/reviews/list/{pno}")
    public DataResponseDTO<List<ReviewDTO>> list(@PathVariable(name="pno") Long pno) {

        return DataResponseDTO.of(reviewService.getList(pno));

    }


}
