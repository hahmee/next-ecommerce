package org.zerock.mallapi.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.AdminCategory;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Product;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {

  @Query("select m from Member m where m.email = :email")
  Optional<Member> selectOne(@Param("email") String email);


  @EntityGraph(attributePaths = {"memberRoleList"})
  @Query("select m from Member m where m.email = :email")
  Member getWithRoles(@Param("email") String email);


  @Query("select m from Member m where m.nickname = :nickname")
  Optional<Member> findByNickname(@Param("nickname") String nickname);


  @Query("select m from Member m where m.encryptedId = :encryptedId")
  Optional<Member> findByEncryptedId(@Param("encryptedId") String encryptedId);


  @EntityGraph(attributePaths = {"memberRoleList"})
  @Query("select m from Member m")
  Page<Member> getMembers(Pageable pageable, @Param("search") String search);



}
