package org.zerock.mallapi.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.dto.*;

import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.service.CartService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.zerock.mallapi.util.GeneralException;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

//    @PreAuthorize("#itemDTO.email == authentication.name")
    @PostMapping("/change")
    public DataResponseDTO<List<CartItemListDTO>> changeCart(@RequestBody CartItemDTO itemDTO, Authentication authentication) {

        log.info("itemDTO............................." + itemDTO);
        log.info("authentication............................." + authentication);

        log.info("itemDTO.email = " + itemDTO.getEmail());
        log.info("auth.name = " + authentication.getName());

        if (!authentication.getName().equals(itemDTO.getEmail())) {
            throw new GeneralException(ErrorCode.INVALID_TOKEN, "이메일 불일치: 인증된 사용자 아님");
        }

        itemDTO.setEmail(authentication.getName());



        if (itemDTO.getQty() <= 0) {
            return DataResponseDTO.of(cartService.remove(itemDTO.getCino()));
        }

        return DataResponseDTO.of(cartService.addOrModify(itemDTO));

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/items")
    public DataResponseDTO<List<CartItemListDTO>> getCartItems(Principal principal) {

        String email = principal.getName();
        log.info("--------------------------------------------");
        log.info("items email: " + email );

        return DataResponseDTO.of(cartService.getCartItems(email));

    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @DeleteMapping("/{cino}")
    public DataResponseDTO<List<CartItemListDTO>> removeFromCart(@PathVariable("cino") Long cino){

        log.info("cart item no: " + cino);

        return DataResponseDTO.of(cartService.remove(cino));

    }


}
