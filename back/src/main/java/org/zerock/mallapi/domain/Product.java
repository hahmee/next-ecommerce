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

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private List<String> categoryList = new ArrayList<>();

  private String sku;

  private SalesStatus salesStatus;

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

  public void changeChangePolicy(String changePolicy){
    this.changePolicy = changePolicy;
  }

  public void changeRefundPolicy(String changePolicy){
    this.refundPolicy = refundPolicy;
  }

  public void changeSku(String sku){
    this.sku = sku;
  }

  public void changeBrand(String brand){
    this.brand = brand;
  }

  public void changeCategoryList(List<String> categoryList){
    this.categoryList = categoryList;
  }

  public void changeSalesStatus(SalesStatus salesStatus){
    this.salesStatus = salesStatus;
  }


  public void addImage(ProductImage image) {

      image.setOrd(this.imageList.size());
      imageList.add(image);
  }

  public void addImageString(String fileName, String fileKey){

    ProductImage productImage = ProductImage.builder()
    .fileName(fileName).fileKey(fileKey)
    .build();
    addImage(productImage);

  }

  public void clearList() {
      this.imageList.clear();
  }

  public void addCategoryString(String category){
    categoryList.add(category);
  }
}
