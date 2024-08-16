package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.service.MemberService;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/api/member/register")
    public Map<String, MemberDTO> register(MemberDTO memberDTO){

        log.info("register: " + memberDTO);

        //서비스 호출
        MemberDTO registeredMemberDTO = memberService.register(memberDTO);

        try {
            Thread.sleep(0);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return Map.of("result", registeredMemberDTO);
    }

//    @PostMapping("/api/member/logout")
//    public Map<String, MemberDTO> logout(){
//
//        //서비스 호출
//        MemberDTO registeredMemberDTO = null;
//
//        try {
//            Thread.sleep(0);
//        } catch (InterruptedException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//
//        return Map.of("result", registeredMemberDTO);
//    }


    @GetMapping("/api/profile")
    public Map<String, MemberDTO> getProfile(@AuthenticationPrincipal UserDetails userDetails) {


        //서비스 호출
        MemberDTO profileDTO = memberService.getProfile(userDetails);
        try {
            Thread.sleep(0);

        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }


        return Map.of("result", profileDTO);
    }
}
