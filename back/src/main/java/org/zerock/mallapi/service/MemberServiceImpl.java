package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.exception.ErrorCode;
import org.zerock.mallapi.repository.MemberRepository;
import org.zerock.mallapi.util.GeneralException;
import org.zerock.mallapi.util.HashUtil;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
          throw new GeneralException(ErrorCode.USER_EMAIL_DUPLICATED, "이미 사용하고 있는 이메일입니다.");
      }

      //닉네임 검사
      Optional<Member> usedNickname = memberRepository.findByNickname(memberDTO.getNickname());

      if(usedNickname.isPresent()){  //문제
          throw new GeneralException(ErrorCode.USER_NICKNAME_DUPLICATED, "이미 사용하고 있는 닉네임입니다.");
      }

      Member member = dtoToEntity(memberDTO);

      //역할 주기
      member.addRole(MemberRole.USER);

      // SHA-256 해싱 알고리즘
      member.changeEncryptedId(HashUtil.hashUserId(member.getEmail()));

      member.setCreatedAt(LocalDateTime.now());
      member.setUpdatedAt(LocalDateTime.now());

      Member result = memberRepository.save(member);

      MemberDTO returnMemberDTO = entityToDTO(result);

      return returnMemberDTO;
  }

    @Override
    public MemberDTO getProfile(UserDetails userDetails) {

       //현재 접속자 이메일 넣기
        String email = userDetails.getUsername();


        Optional<Member> result = Optional.ofNullable(memberRepository.getWithRoles(email));


        Member member = result.orElseThrow(
                () -> new GeneralException(ErrorCode.NOT_FOUND, "해당 멤버를 찾을 수 없습니다.")
        );

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
        throw new GeneralException(ErrorCode.NULL_TOKEN, "Access Token is null");
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


    LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();


    LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");


    return kakaoAccount.get("email");

  }

  private Member makeSocialMember(String email) {

   String tempPassword = makeTempPassword();


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
    public MemberDTO get(String email) {

        java.util.Optional<Member> result = memberRepository.selectOne(email);


        Member member = result.orElseThrow(
                () -> new GeneralException(ErrorCode.NOT_FOUND, "멤버를 찾을 수 없습니다.")
        );

        MemberDTO memberDTO = entityToDTO(member);

        return memberDTO;

    }

    @Override
    public PageResponseDTO<MemberDTO> getUsers(SearchRequestDTO searchRequestDTO) {

        Pageable pageable = PageRequest.of(
                searchRequestDTO.getPage() - 1,  //페이지 시작 번호가 0부터 시작하므로
                searchRequestDTO.getSize(),
                Sort.by("id").descending());

        String search = searchRequestDTO.getSearch();

        Page<Member> members = memberRepository.getMembers(pageable, search);


        //여기에서 subCategory있으면 넣어주기
        List<MemberDTO> responseDTO = members.stream().map(this::entityToDTO).collect(Collectors.toList());


        long totalCount = members.getTotalElements();

        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().page(searchRequestDTO.getPage()).size(searchRequestDTO.getSize()).build();

        return PageResponseDTO.<MemberDTO>withAll()
                .dtoList(responseDTO)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();


    }




    @Override
  public void modifyMember(MemberModifyDTO memberModifyDTO) {

    Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());


    Member member  = result.orElseThrow(
                () -> new GeneralException(ErrorCode.NOT_FOUND, "멤버를 찾을 수 없습니다.")
    );

    member.changePassword(passwordEncoder.encode(memberModifyDTO.getPassword()));
    member.changeSocial(false);
    member.changeNickname(memberModifyDTO.getNickname());

    memberRepository.save(member);

  }

  
}
