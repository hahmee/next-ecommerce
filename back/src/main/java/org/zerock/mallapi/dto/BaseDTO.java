package org.zerock.mallapi.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BaseDTO {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}