package org.zerock.mallapi.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.service.MemberService;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Log4j2
public class AuthController {
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
}
