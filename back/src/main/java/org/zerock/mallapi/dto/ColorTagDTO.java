package org.zerock.mallapi.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ColorTagDTO {

    private Long id;
    private String text;
    private String color;

}
