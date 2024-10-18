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
public class SeriesDTO<T> {

    private String name;
    private List<T> data; //Double도 필요해 ...

}
