package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_product")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long pno;

  private String pname;

  private int price;

  private String pdesc;

  private boolean delFlag;

  private String brand;

  private String category;

  private String sku;

  private boolean inStock;

  private String refundPolicy;

  private String changePolicy;

  @ManyToOne
  @JoinColumn(name="member_owner")
  private Member owner; // 유저

  public void changeDel(boolean delFlag) {
    this.delFlag = delFlag;
  }

  @ElementCollection
  @Builder.Default
  private List<ProductImage> imageList = new ArrayList<>();

  public void changePrice(int price) {
    this.price = price;
  }

  public void changeDesc(String desc){
      this.pdesc = desc;
  }

  public void changeName(String name){
      this.pname = name;
  }

  public void addImage(ProductImage image) {

      image.setOrd(this.imageList.size());
      imageList.add(image);
  }

  public void addImageString(String fileName){

    ProductImage productImage = ProductImage.builder()
    .fileName(fileName)
    .build();
    addImage(productImage);

  }

  public void clearList() {
      this.imageList.clear();
  }
}
