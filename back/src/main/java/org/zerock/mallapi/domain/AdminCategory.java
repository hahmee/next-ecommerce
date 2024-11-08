package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.log4j.Log4j2;

@Entity
@Table(name = "tbl_category")
@Getter
@ToString(exclude = "image")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
public class AdminCategory extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long cno;

  private String cname;

  private String cdesc;

  private boolean delFlag;

  @Builder.Default
  private CategoryImage image = null;


  //순서도 추가
  public void changeName(String cname) {
    this.cname = cname;
  }

  public void changeDesc(String cdesc) {
    this.cdesc = cdesc;
  }
  public void changeDelFlag(boolean delFlag) {
    this.delFlag = delFlag;
  }

  public void changeCategoryImage(CategoryImage image) {
    this.image = image;
  }

}

