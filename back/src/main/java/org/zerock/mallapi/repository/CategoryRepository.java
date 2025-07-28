package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.AdminCategory;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

// 카테고리의 정보를 저장하는 테이블에 대한 CRUD
public interface CategoryRepository extends JpaRepository<AdminCategory, Long> {

    List<AdminCategory> findByCnoIn(Set<Long> cnoSet);

    @Query("SELECT DISTINCT c FROM AdminCategory c " +
            "JOIN CategoryClosure cc ON cc.id.descendant = c")
    List<AdminCategory> findAllCategories();

    @Query("SELECT c FROM AdminCategory c " +
            "JOIN CategoryClosure cc ON cc.id.descendant = c")
    List<AdminCategory> findAllCategoriesByTree();

    @Query("""
                SELECT DISTINCT c
                FROM AdminCategory c
                WHERE (
                    c.cname LIKE concat('%', :search, '%')
                    OR EXISTS (
                        SELECT 1
                        FROM CategoryClosure cc
                        WHERE cc.id.ancestor.cno = c.cno
                            AND cc.id.descendant.cname LIKE concat('%', :search, '%')
                    )
                )
                AND c.cno NOT IN (
                    SELECT cc.id.descendant.cno
                    FROM CategoryClosure cc
                    WHERE cc.depth = 1
                )
                AND c.delFlag = false
            """)
    Page<AdminCategory> searchAdminList(Pageable pageable, @Param("search") String search); // 검색 시 최상위 카테고리만 가져오기 - 루트 노드만 가져오기


    @Query("SELECT c FROM AdminCategory c WHERE c.cno NOT IN (SELECT cc.id.descendant.cno FROM CategoryClosure cc WHERE cc.depth = 1) AND c.delFlag = false")
    List<AdminCategory> findRootCategories();


    @Query("select c from AdminCategory c where c.cno = :cno and c.delFlag = false")
    Optional<AdminCategory> selectOne(@Param("cno") Long cno);


    @Modifying
    @Query("update AdminCategory c set c.delFlag = :flag where c.cno = :cno")
    void updateToDelete(@Param("cno") Long cno , @Param("flag") boolean flag);


}
