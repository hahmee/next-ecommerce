package org.zerock.mallapi.domain;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_color_tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ColorTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    private String color;

}
