package org.zerock.mallapi.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.*;

import org.zerock.mallapi.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @PreAuthorize("#itemDTO.email == authentication.name")
    @PostMapping("/change")
    public DataResponseDTO<List<CartItemListDTO>> changeCart(@RequestBody CartItemDTO itemDTO){

        log.info("itemDTO............................." + itemDTO);

        if(itemDTO.getQty() <= 0) {
            return DataResponseDTO.of(cartService.remove(itemDTO.getCino()));
        }

        return DataResponseDTO.of(cartService.addOrModify(itemDTO));

    }


    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN')")
    @GetMapping("/items")
    public DataResponseDTO<List<CartItemListDTO>> getCartItems(Principal principal) {

        String email = principal.getName();
        log.info("--------------------------------------------");
        log.info("email: " + email );

        return DataResponseDTO.of(cartService.getCartItems(email));


    }

    @PreAuthorize("hasAnyRole('ROLE_USER')")
    @DeleteMapping("/{cino}")
    public DataResponseDTO<List<CartItemListDTO>> removeFromCart( @PathVariable("cino") Long cino){

        log.info("cart item no: " + cino);

        return DataResponseDTO.of(cartService.remove(cino));

    }


}
