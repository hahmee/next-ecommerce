package org.zerock.mallapi.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryImage {

    private String fileName; //전체 url

    private String fileKey; //이름만(for s3)
}
