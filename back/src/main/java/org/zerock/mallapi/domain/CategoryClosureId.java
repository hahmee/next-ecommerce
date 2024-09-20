package org.zerock.mallapi.domain;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

//복합키 설정
@Getter
@Embeddable
@Builder // Lombok Builder 적용
@AllArgsConstructor // 생성자 자동 생성
@NoArgsConstructor  // 기본 생성자 자동 생성
@EqualsAndHashCode  // equals 및 hashCode 자동 생성
public class CategoryClosureId implements Serializable {

    @ManyToOne
    private AdminCategory ancestor;

    @ManyToOne
    private AdminCategory descendant;


}