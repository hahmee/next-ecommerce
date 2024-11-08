package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.log4j.Log4j2;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_product")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
public class Product extends BaseEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long pno;

  private String pname;

  private int price;

  private String pdesc;

  private boolean delFlag;

  private String brand;

//  @ElementCollection(fetch = FetchType.LAZY)
//  @Builder.Default
//  private List<String> categoryList = new ArrayList<>();

  @ElementCollection(fetch = FetchType.LAZY)
  @Builder.Default
  private List<String> sizeList = new ArrayList<>();

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JoinColumn(name = "product_id")
  @Builder.Default
  private List<ColorTag> colorList = new ArrayList<>();

  private String sku;

  private SalesStatus salesStatus;

  private String refundPolicy;

  private String changePolicy;

  @ManyToOne
  @JoinColumn(name = "admin_category")
  private AdminCategory adminCategory; //제일 하위 카테고리

  @ManyToOne
  @JoinColumn(name = "member_owner")
  private Member owner; // 판매자 유저

  @ElementCollection
  @Builder.Default
  @OrderBy("ord ASC") // ord 필드 기준으로 오름차순 정렬
  private List<ProductImage> imageList = new ArrayList<>();

  public void changeDel(boolean delFlag) {
    this.delFlag = delFlag;
  }

  public void changePrice(int price) {
    this.price = price;
  }

  public void changeDesc(String desc) {
    this.pdesc = desc;
  }

  public void changeName(String name) {
    this.pname = name;
  }

  public void changeChangePolicy(String changePolicy) {
    this.changePolicy = changePolicy;
  }

  public void changeRefundPolicy(String refundPolicy) {
    this.refundPolicy = refundPolicy;
  }

  public void changeSku(String sku) {
    this.sku = sku;
  }

  public void changeBrand(String brand) {
    this.brand = brand;
  }

//  public void changeCategoryList(List<String> categoryList) {
//    this.categoryList = categoryList;
//  }

  public void changeSizeList(List<String> sizeList) {
    this.sizeList = sizeList;
  }

  public void changeSalesStatus(SalesStatus salesStatus) {
    this.salesStatus = salesStatus;
  }

  public void changeAdminCategory(AdminCategory adminCategory) {
    this.adminCategory = adminCategory;
  }

  public void addImage(ProductImage image) {
    imageList.add(image);
  }

  public void addImageString(String fileName, String fileKey, int ord) {

    ProductImage productImage = ProductImage.builder()
            .fileName(fileName).fileKey(fileKey).ord(ord)
            .build();
    addImage(productImage);

  }

  public void clearList() {
    this.imageList.clear();
  }


  public void addColorTag(String color, String text) {

    ColorTag colorTag = ColorTag.builder()
            .text(text)
            .color(color)
            .build();

    colorList.add(colorTag);

  }

  public void clearColorList() {
    this.colorList.clear();
  }

//  public void addCategoryString(String category) {
//    categoryList.add(category);
//  }
}
