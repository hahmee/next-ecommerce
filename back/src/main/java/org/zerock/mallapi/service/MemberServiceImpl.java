package org.zerock.mallapi.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.zerock.mallapi.util.EmailDuplicateException;
import org.zerock.mallapi.util.NicknameDuplicateException;

import javax.swing.text.html.Option;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

  private final MemberRepository memberRepository;

  private final PasswordEncoder passwordEncoder;


  @Override
  public MemberDTO register(MemberDTO memberDTO) {


      //유효성 검사
      //이메일 검사
      if(memberRepository.existsById(memberDTO.getEmail())){
              throw new EmailDuplicateException("Email duplicated");
      }

      //닉네임 검사
      Optional<Member> usedNickname = memberRepository.findByNickname(memberDTO.getNickname());

      if(usedNickname.isPresent()){  //문제
          throw new NicknameDuplicateException("Nickname duplicated");
      }


      Member member = dtoToEntity(memberDTO);

      Member result = memberRepository.save(member);

      MemberDTO returnMemberDTO = entityToDTO(result);

      return returnMemberDTO;
  }

    @Override
    public MemberDTO getProfile(UserDetails userDetails) {

        log.info("--------------userDetails   " + userDetails);
      //현재 접속자 이메일 넣기

        String email = userDetails.getUsername();
        log.info("--------------email      " + email);


      java.util.Optional<Member> result = Optional.ofNullable(memberRepository.getWithRoles(email));

      Member member = result.orElseThrow();

      MemberDTO memberDTO = entityToDTO(member);

      return memberDTO;
    }


    private Member dtoToEntity(MemberDTO memberDTO){

        Member member = Member.builder()
                .email(memberDTO.getEmail())
                .password(passwordEncoder.encode(memberDTO.getPassword()))
                .nickname(memberDTO.getNickname())
                .build();

        return member;
    }


  @Override
  public MemberDTO getKakaoMember(String accessToken) {

    String email = getEmailFromKakaoAccessToken(accessToken);

    log.info("email: " + email );

    Optional<Member> result = memberRepository.findById(email);

   //기존의 회원
   if(result.isPresent()){

    MemberDTO memberDTO = entityToDTO(result.get());

    return memberDTO;

   }

   //회원이 아니었다면 
   //닉네임은 '소셜회원'으로
   //패스워드는 임의로 생성  
   Member socialMember = makeSocialMember(email);
   memberRepository.save(socialMember);

   MemberDTO memberDTO = entityToDTO(socialMember);

   return memberDTO;

  }


  private String getEmailFromKakaoAccessToken(String accessToken){

    String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

    if(accessToken == null){
      throw new RuntimeException("Access Token is null");
    }
    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "Bearer " + accessToken);
    headers.add("Content-Type","application/x-www-form-urlencoded");
    HttpEntity<String> entity = new HttpEntity<>(headers);

    UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

    ResponseEntity<LinkedHashMap> response = 
      restTemplate.exchange(
      uriBuilder.toString(), 
      HttpMethod.GET, 
      entity, 
      LinkedHashMap.class);

    log.info(response);

    LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();

    log.info("------------------------------------");
    log.info(bodyMap);

    LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");

    log.info("kakaoAccount: " + kakaoAccount);

    return kakaoAccount.get("email");

  }

  private Member makeSocialMember(String email) {

   String tempPassword = makeTempPassword();

   log.info("tempPassword: " + tempPassword);

   String nickname = "소셜회원";

   Member member = Member.builder()
   .email(email)
   .password(passwordEncoder.encode(tempPassword))
   .nickname(nickname)
   .social(true)
   .build();

   member.addRole(MemberRole.USER);

   return member;

  }


  private String makeTempPassword() {

    StringBuffer buffer = new StringBuffer();

    for(int i = 0;  i < 10; i++){
      buffer.append(  (char) ( (int)(Math.random()*55) + 65  ));
    }
    return buffer.toString();
  }


  @Override
  public void modifyMember(MemberModifyDTO memberModifyDTO) {

    Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());

    Member member = result.orElseThrow();

    member.changePassword(passwordEncoder.encode(memberModifyDTO.getPassword()));
    member.changeSocial(false);
    member.changeNickname(memberModifyDTO.getNickname());

    memberRepository.save(member);

  }

  
}
