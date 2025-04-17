-- 예시 데이터 삽입
--USER
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user1@aaa.com', 'USER1', '$2a$10$jnhB3L2L0my4QQoq6ANkKua4mtKGG1XHNBeGlJHuoGMsxcxh2Mb4S', false, null);


-- USER ROLE
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user1@aaa.com', 2);


