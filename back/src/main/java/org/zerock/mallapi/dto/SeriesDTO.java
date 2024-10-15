package org.zerock.mallapi.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class SeriesDTO {

    private String name;
    private List<Long> data;

}
