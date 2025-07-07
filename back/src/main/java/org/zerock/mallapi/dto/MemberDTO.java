package org.zerock.mallapi.dto;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.zerock.mallapi.domain.MemberRole;

@Getter
@Setter
@ToString
public class MemberDTO extends User {

  private String email;
    
  private String password;

  private String nickname;

  private boolean social;

  private List<MemberRole> roleNames = new ArrayList<>();

  private String encryptedId; // User-ID 암호화 (GA4사용목적)

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

//  public MemberDTO(String email, String password, String nickname, boolean social, List<MemberRole> roleNames, String encryptedId, LocalDateTime createdAt, LocalDateTime updatedAt) {
//    super(email, password, roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList()));
//    this.email = email;
//    this.password = password;
//    this.nickname = nickname;
//    this.social = social;
//    this.roleNames = roleNames;
//    this.encryptedId = encryptedId;
//    this.createdAt = createdAt;
//    this.updatedAt = updatedAt;
//  }


  public MemberDTO(String email, String password, String nickname, boolean social, List<MemberRole> roleNames, String encryptedId, LocalDateTime createdAt, LocalDateTime updatedAt) {
    super(email, password,
            roleNames != null
                    ? roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList())
                    : new ArrayList<>()
    );
    this.email = email;
    this.password = password;
    this.nickname = nickname;
    this.social = social;
    this.roleNames = roleNames != null ? roleNames : new ArrayList<>();
    this.encryptedId = encryptedId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }


  public Map<String, Object> getClaims() {

    Map<String, Object> dataMap = new HashMap<>();

    dataMap.put("email", email);
    dataMap.put("password",password);
    dataMap.put("nickname", nickname);
    dataMap.put("social", social);
    dataMap.put("roleNames", roleNames);
    dataMap.put("encryptedId", encryptedId);

    return dataMap;
  }

  // 민감 정보 제외
  public MemberPublicDTO toPublicDTO() {
    return  MemberPublicDTO.builder()
            .email(this.email)
            .nickname(this.nickname)
            .roleNames(this.roleNames)
            .build();
  }
}
