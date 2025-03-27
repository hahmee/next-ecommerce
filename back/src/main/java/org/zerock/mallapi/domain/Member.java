package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString (exclude = "memberRoleList")
public class Member extends BaseEntity{

  @Id
  private String email;

  private String password;

  private String nickname;

  private boolean social;

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private List<MemberRole> memberRoleList = new ArrayList<>();

  private String encryptedId; // User-ID 암호화 (GA4사용목적)

  public void addRole(MemberRole memberRole){
      memberRoleList.add(memberRole);
  }

  public void clearRole(){
      memberRoleList.clear();
  }

  public void changeNickname(String nickname) {
    this.nickname = nickname;
  }

  public void changePassword(String password){
    this.password = password;
  }

  public void changeSocial(boolean social) {
    this.social = social;
  }

  public void changeEncryptedId(String encryptedId) {
    this.encryptedId = encryptedId;
  }


}
