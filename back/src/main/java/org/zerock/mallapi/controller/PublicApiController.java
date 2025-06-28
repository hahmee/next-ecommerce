package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.CategoryDTO;
import org.zerock.mallapi.dto.DataResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.dto.ReviewDTO;
import org.zerock.mallapi.service.CategoryService;
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
    private final CategoryService categoryService;

    @GetMapping("/products/newProductList")
    public DataResponseDTO<List<ProductDTO>> getNewProducts() {

        return DataResponseDTO.of(productService.getNewProducts());
    }

    @GetMapping("/products/featuredProductList")
    public DataResponseDTO<List<ProductDTO>> getFeaturedProducts() {
        return DataResponseDTO.of(productService.getFeaturedProducts());
    }

    @GetMapping("/products/expertProducts")
    public DataResponseDTO<List<ProductDTO>> getExpertProducts() {
        return DataResponseDTO.of(productService.getExpertProducts());
    }

    @GetMapping("/products/{pno}")
    public DataResponseDTO<ProductDTO> read(@PathVariable(name="pno") Long pno) {

        ProductDTO productDTO = productService.get(pno);
        return DataResponseDTO.of(productDTO);
    }

    @GetMapping("/reviews/list/{pno}")
    public DataResponseDTO<List<ReviewDTO>> list(@PathVariable(name="pno") Long pno) {

        return DataResponseDTO.of(reviewService.getList(pno));

    }

    @GetMapping("/category/list")
    public DataResponseDTO<List<CategoryDTO>> list() {
        return DataResponseDTO.of(categoryService.getAllCategories());
    }



}
