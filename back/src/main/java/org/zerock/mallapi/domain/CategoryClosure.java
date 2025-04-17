package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.log4j.Log4j2;

@Entity
@Table(name = "tbl_category_closure")
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
public class CategoryClosure {

    @EmbeddedId
    private CategoryClosureId id;

    private int depth;

}
