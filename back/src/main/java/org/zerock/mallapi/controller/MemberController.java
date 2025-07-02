package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.service.MemberService;
import org.zerock.mallapi.util.GeneralException;

@RestController
@RequiredArgsConstructor
@Log4j2
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/api/member/register")
    public DataResponseDTO<MemberDTO> register(MemberDTO memberDTO){

        log.info("register: " + memberDTO);

        //서비스 호출
        MemberDTO registeredMemberDTO = memberService.register(memberDTO);

        return DataResponseDTO.of(registeredMemberDTO);
    }

    /** 로그인한 사용자 정보 조회 */
    @GetMapping("/api/me")
    public DataResponseDTO<MemberPublicDTO> getMyInfo(@AuthenticationPrincipal MemberDTO member) {
        log.info("🔥 [API] /api/member/me 호출됨");
        log.info("member...." + member);

        if (member == null) {
            throw new GeneralException(ErrorCode.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return DataResponseDTO.of(member.toPublicDTO());

    }


    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/api/profile")
    public DataResponseDTO<MemberDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {

        log.info("..... userDetails " + userDetails);

        //서비스 호출
        MemberDTO profileDTO = memberService.getProfile(userDetails);

        log.info("..... profileDTO " + profileDTO);
        return DataResponseDTO.of(profileDTO);
    }


    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_ADMIN','ROLE_DEMO')")
    @GetMapping("/api/members") // members?search=검색어&page=1&size=10
    public DataResponseDTO<PageResponseDTO<MemberDTO>> getUsers(SearchRequestDTO searchRequestDTO) {


        DataResponseDTO<PageResponseDTO<MemberDTO>> result =  DataResponseDTO.of(memberService.getUsers(searchRequestDTO));


        return result;

    }

}
