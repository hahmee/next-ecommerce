package org.zerock.mallapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mallapi.domain.AdminCategory;

// 카테고리의 정보를 저장하는 테이블에 대한 CRUD
public interface CategoryRepository extends JpaRepository<AdminCategory, Long>{



}
