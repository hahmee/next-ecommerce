DROP DATABASE IF EXISTS apidb;
CREATE DATABASE apidb;
USE apidb;

-- 사용자 생성 (비밀번호는 환경변수에서 설정한 값을 사용)
CREATE USER IF NOT EXISTS 'apidbuser'@'localhost' IDENTIFIED BY 'apidbuser';
CREATE USER IF NOT EXISTS 'apidbuser'@'%' IDENTIFIED BY 'apidbuser';

-- 사용자에게 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON apidb.* TO 'apidbuser'@'localhost';
GRANT ALL PRIVILEGES ON apidb.* TO 'apidbuser'@'%';

-- 권한 적용
FLUSH PRIVILEGES;

-- 테이블 생성

create table member
(
    email        varchar(255) not null
        primary key,
    nickname     varchar(255) null,
    password     varchar(255) null,
    social       bit          not null,
    encrypted_id varchar(255) null
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('test@aaa.com', 'test', '$2a$10$341QUdzBCf.GmpLo17nH5uTIkYPCE5QYcP2fkyicbBVEL.a430QdW', false, '48abe7b514cc616d5c92efb36c1777e9ca63ab840aab25a722da63cce8549965');
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user1@aaa.com', 'USER1', '$2a$10$jnhB3L2L0my4QQoq6ANkKua4mtKGG1XHNBeGlJHuoGMsxcxh2Mb4S', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user2@aaa.com', 'USER2', '$2a$10$Im2GAgKbMUKHXoOXK3dZAeTeUpdkTEG78cM6drco/36GKoHmPc1IG', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user3@aaa.com', 'USER3', '$2a$10$JmLOnSrs0Z5QacwkMsai5eDMQV55kBjmhyAYo/wXEKffD9MGuwj06', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user4@aaa.com', 'USER4', '$2a$10$uNOBz/6vYpvrgoNxbJdMdOprD9A1jDTQlza3rn2nfLeEoA/7jf2sO', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user5@aaa.com', 'USER5', '$2a$10$XXiBmLu2kiGuYfTZh.wSi.VmOBssgYuKrZw/Q2VObTVl1YbLsDf0.', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user6@aaa.com', 'USER6', '$2a$10$cWumMVXmXrNzR4RVkSptmuc6pRLQuE7h0bZYOOgvgrQ6tgM23fd6S', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user7@aaa.com', 'USER7', '$2a$10$lb6Lw7uhJZQuGk7tyONpHOrnMGDfEHZOVhtCI3W4iyIPzGYUvtoCC', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user8@aaa.com', 'USER8', '$2a$10$JzV7MwHQL1oi0H.91c8FSuRI8yDgB92s/8jnFHoMad8vOTmv/cMWO', false, null);
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user9@aaa.com', 'USER9', '$2a$10$mvxa85LaAKv6n72WHmaq5.eagqUZbr6TxK/FNR4/TbtoXQyykJI5q', false, null);


create table member_member_role_list
(
    member_email     varchar(255) not null,
    member_role_list tinyint      null
        check (`member_role_list` between 0 and 2),
    constraint FK2cojwm6nbbasi0xkedqjjagap
        foreign key (member_email) references member (email)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user1@aaa.com', 2);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user2@aaa.com', 2);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('test@aaa.com', 0);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user3@aaa.com', 2);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user4@aaa.com', 1);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user5@aaa.com', 1);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user6@aaa.com', 1);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user7@aaa.com', 1);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user8@aaa.com', 1);
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user9@aaa.com', 1);


create table tbl_payment
(
    id           bigint auto_increment
        primary key,
    created_at   datetime(6)  null,
    updated_at   datetime(6)  null,
    country      varchar(255) null,
    method       tinyint      null
        check (`method` between 0 and 2),
    order_id     varchar(255) null,
    order_name   varchar(255) null,
    payment_key  varchar(255) null,
    status       tinyint      null
        check (`status` between 0 and 7),
    total_amount int          not null,
    type         tinyint      null
        check (`type` between 0 and 2),
    member_owner varchar(255) null,
    constraint FKe7v3apj7ter215xcr54xhbkwc
        foreign key (member_owner) references member (email)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES ('2025-02-27 23:50:37.628792', '2025-02-27 23:50:37.628792', 'KR', 2, 'u2wpgb1wbp', 'Product1', 'tviva20250227234908E4dn5', 3, 16275, 0, 'user1@aaa.com');
INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES ('2025-02-28 00:25:14.717991', '2025-02-28 00:25:14.717991', 'KR', 2, 'eegy5wh642q', 'Product1 외 1개', 'tviva20250228002445uJ1u2', 3, 41475, 0, 'user1@aaa.com');
INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES ('2025-02-28 17:34:03.216548', '2025-02-28 17:34:03.216548', 'KR', 2, 'cn63g68bike', '좋은 short sleeves 외 6개', 'tviva20250228173327EgPH9', 3, 97440, 0, 'user1@aaa.com');
INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES ('2025-02-28 21:02:45.922932', '2025-02-28 21:02:45.922932', 'KR', 2, '78ktbzfkrqa', '여성 반팔티 외 1개', 'tviva20250228210213q5TM8', 3, 640920, 0, 'user1@aaa.com');
INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES ('2025-02-28 22:10:35.746542', '2025-02-28 22:10:35.746542', 'KR', 2, 'hgdb2sq57le', '여성 반팔티 외 1개', 'tviva20250228221003v9nJ7', 3, 640920, 0, 'user1@aaa.com');
INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES ('2025-02-28 22:15:08.930605', '2025-02-28 22:15:08.930605', 'KR', 2, 'f8orvy9vthp', '여성 반팔티 외 1개', 'tviva20250228221432r5tv9', 3, 640920, 0, 'user2@aaa.com');


create table tbl_order_payment
(
    id         bigint auto_increment
        primary key,
    order_id   bigint null,
    payment_id bigint null
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (1, 1);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (2, 2);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (3, 2);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (4, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (5, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (6, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (7, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (8, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (9, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (10, 3);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (11, 4);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (12, 4);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (13, 5);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (14, 5);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (15, 6);
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES (16, 6);

create table tbl_category
(
    cno        bigint auto_increment
        primary key,
    created_at datetime(6)  null,
    updated_at datetime(6)  null,
    cdesc      varchar(255) null,
    cname      varchar(255) null,
    del_flag   bit          not null,
    file_key   varchar(255) null,
    file_name  varchar(255) null
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-27 23:26:02.988972', '2025-02-28 17:21:39.021816', 'category1', '카테고리1', false, 'category/f32d3517-3ec3-4792-a16b-2d359a850de7_annie-spratt-qyAka7W5uMY-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/f32d3517-3ec3-4792-a16b-2d359a850de7_annie-spratt-qyAka7W5uMY-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-27 23:26:27.151694', '2025-02-28 17:21:51.462641', 'subCategory1-1', '카테고리1-1', false, 'category/760ea912-9c38-46a8-af22-9c2c9343a45b_daria-nepriakhina-xY55bL5mZAM-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/760ea912-9c38-46a8-af22-9c2c9343a45b_daria-nepriakhina-xY55bL5mZAM-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-27 23:27:05.954157', '2025-02-28 17:21:34.450794', 'category2', '카테고리2', false, 'category/29e5c490-8fef-496d-81b0-8ab4fc8a6243_firmbee-com-SpVHcbuKi6E-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/29e5c490-8fef-496d-81b0-8ab4fc8a6243_firmbee-com-SpVHcbuKi6E-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-28 16:00:05.943541', '2025-02-28 17:21:56.650815', 'subCategory1-2', '카테고리1-2', false, 'category/c3b16252-4922-486f-bf91-132dbd22d783_NEWYORK.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/c3b16252-4922-486f-bf91-132dbd22d783_NEWYORK.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-28 16:00:38.285137', '2025-02-28 17:21:45.884725', 'subCategory2-2', '카테고리2-2', false, 'category/5cc6ab85-499b-4a9b-ae80-6cb39ae9c5a6_sincerely-media-nGrfKmtwv24-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/5cc6ab85-499b-4a9b-ae80-6cb39ae9c5a6_sincerely-media-nGrfKmtwv24-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-28 16:01:05.240311', '2025-02-28 17:21:30.082312', 'category3', '카테고리3', false, 'category/3dc6e333-3eb5-412d-8ee2-7365199b935b_sven-d-a4S6KUuLeoM-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/3dc6e333-3eb5-412d-8ee2-7365199b935b_sven-d-a4S6KUuLeoM-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-28 16:01:14.250236', '2025-02-28 17:21:25.866749', 'category4', '카테고리4', false, 'category/2184ee10-af36-4a7e-bdb1-0abd39482384_mediamodifier-elbKS4DY21g-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/2184ee10-af36-4a7e-bdb1-0abd39482384_mediamodifier-elbKS4DY21g-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-28 16:01:44.993172', '2025-02-28 17:31:38.307731', 'subCategory1-1-1', '서브카테고리1-1-1', false, 'category/14bbd0dd-1098-41cf-b582-9e375ea1fcb2_KakaoTalk_20241008_144033593.png', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/14bbd0dd-1098-41cf-b582-9e375ea1fcb2_KakaoTalk_20241008_144033593.png');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-03-09 14:45:39.283070', '2025-03-09 14:46:20.058058', 'category5', '카테고리5', false, 'category/1dbcc5db-022d-46d9-9a03-59e782e7c8ec_nathan-dumlao-6VhPY27jdps-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/1dbcc5db-022d-46d9-9a03-59e782e7c8ec_nathan-dumlao-6VhPY27jdps-unsplash.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-03-09 14:46:33.447235', '2025-03-09 14:46:33.447235', 'category6', '카테고리6', false, 'category/8904cb49-79e4-4416-a3be-989d0d875407_anna-pelzer-IGfIGP5ONV0-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/8904cb49-79e4-4416-a3be-989d0d875407_anna-pelzer-IGfIGP5ONV0-unsplash.jpg');


create table tbl_category_closure
(
	depth int not null,
	descendant_cno bigint not null,
	ancestor_cno bigint not null,
	primary key (ancestor_cno, descendant_cno),
	constraint FK4ocjdplm8qkynki9xbv8u9ewa
		foreign key (ancestor_cno) references tbl_category (cno),
	constraint FKtqmnhrab7f7o30ivo487p3ppv
		foreign key (descendant_cno) references tbl_category (cno)
)
collate=utf8mb4_general_ci;

INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 1, 1);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (1, 2, 1);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (1, 4, 1);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (2, 8, 1);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 2, 2);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (1, 8, 2);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 3, 3);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (1, 5, 3);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 4, 4);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 5, 5);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 6, 6);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 7, 7);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 8, 8);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 9, 9);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 10, 10);





create table tbl_product
(
    pno            bigint auto_increment
        primary key,
    created_at     datetime(6)  null,
    updated_at     datetime(6)  null,
    change_policy  varchar(255) null,
    del_flag       bit          not null,
    pdesc          varchar(255) null,
    pname          varchar(255) null,
    price          bigint       null,
    refund_policy  varchar(255) null,
    sales_status   tinyint      null
        check (`sales_status` between 0 and 2),
    sku            varchar(255) null,
    admin_category bigint       null,
    member_owner   varchar(255) null,
    constraint FK25sphjrqy9564f68j5cc2rcb2
        foreign key (member_owner) references member (email),
    constraint FKs8hga2mxmtge74loayofk62u8
        foreign key (admin_category) references tbl_category (cno)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-27 23:48:38.226118', '2025-02-28 17:22:58.386971', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis</p>', '비싸고 좋은 Bag', 12000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku', 2, 'user1@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 00:15:37.530526', '2025-02-28 17:22:49.688382', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '새로운 Shoes', 12000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku', 3, 'user1@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 16:03:48.806901', '2025-02-28 17:22:40.971132', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', 'Nice woman dress', 12500, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku', 8, 'user1@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 16:06:04.443754', '2025-02-28 17:22:35.465728', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '굿 퀄리티 White Shirts', 5000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 1, 'wlekfasdf', 6, 'user1@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 17:13:11.678346', '2025-02-28 17:22:28.469064', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '좋은 short sleeves', 15800, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku', 8, 'user1@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 17:15:09.366805', '2025-02-28 17:22:20.753369', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '멋진 Sport item', 20000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku-asdfasdf', 7, 'user1@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 17:26:05.044278', '2025-02-28 17:26:05.044278', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '질긴 청바지', 19996, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku-23123', 4, 'user2@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 17:27:29.557238', '2025-02-28 17:27:29.557238', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p><span class="ql-cursor">﻿</span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '방수 블랙 재킷', 555000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku-123123', 7, 'user2@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 17:28:43.361173', '2025-02-28 17:28:43.361173', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '예쁜 바지', 555000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku-5454', 6, 'user2@aaa.com');
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES ('2025-02-28 17:30:36.199663', '2025-02-28 17:30:36.199663', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', false, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '여성 반팔티', 55400, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
', 0, 'sku-1231', 8, 'user2@aaa.com');


create table product_image_list
(
    product_pno bigint       not null,
    file_key    varchar(255) null,
    file_name   varchar(255) null,
    ord         int          not null,
    constraint FKfqvvs4dg13jiki1fur4s3qa43
        foreign key (product_pno) references tbl_product (pno)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (6, 'product/fe0796bb-b6d1-4203-8efd-5a15df2d27b9_sporty-woman-carrying-blue-duffle-bag-gym-essentials-studio-shoot_53876-104988.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/fe0796bb-b6d1-4203-8efd-5a15df2d27b9_sporty-woman-carrying-blue-duffle-bag-gym-essentials-studio-shoot_53876-104988.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (6, 'product/6c47a9b1-64e5-4fee-bbe1-7a183fad5b98_view-trucker-hat-with-badminton-set_23-2149410093.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/6c47a9b1-64e5-4fee-bbe1-7a183fad5b98_view-trucker-hat-with-badminton-set_23-2149410093.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (5, 'product/2d547579-46ea-4e08-b7e5-ed8764e8497d_man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/2d547579-46ea-4e08-b7e5-ed8764e8497d_man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (5, 'product/875dc8b8-9a48-4754-985f-bcff87236abc_man-wearing-basic-gray-polo-shirt-apparel_53876-102221.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/875dc8b8-9a48-4754-985f-bcff87236abc_man-wearing-basic-gray-polo-shirt-apparel_53876-102221.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (5, 'product/6fe44e37-05af-4bb7-97b6-e177dc62295e_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/6fe44e37-05af-4bb7-97b6-e177dc62295e_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 2);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (4, 'product/0334ab8c-d8b2-482c-9893-af28853c6883_simple-white-crew-neck-unisex-streetwear-apparel_53876-123185.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/0334ab8c-d8b2-482c-9893-af28853c6883_simple-white-crew-neck-unisex-streetwear-apparel_53876-123185.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (4, 'product/d927dfd5-4144-40a9-bc8c-375de8d5c7c1_man-wearing-white-sweater-close-up-rear-view_53876-128791.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/d927dfd5-4144-40a9-bc8c-375de8d5c7c1_man-wearing-white-sweater-close-up-rear-view_53876-128791.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (4, 'product/4a40ac2f-b80d-48e3-9192-37d676f94201_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/4a40ac2f-b80d-48e3-9192-37d676f94201_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 2);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (3, 'product/be1bcd38-b96e-44e8-b6fb-cccc7e7afe98_1705649353000-Btpm4F.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/be1bcd38-b96e-44e8-b6fb-cccc7e7afe98_1705649353000-Btpm4F.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (3, 'product/1e4e2d5b-2435-470f-9a52-a8133761bcc6_1705392906000-42mkpA.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/1e4e2d5b-2435-470f-9a52-a8133761bcc6_1705392906000-42mkpA.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (2, 'product/a2358edf-e8da-43b3-9af5-8162d645588a_new-pair-white-sneakers-isolated-white_93675-126299.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/a2358edf-e8da-43b3-9af5-8162d645588a_new-pair-white-sneakers-isolated-white_93675-126299.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (2, 'product/9b8d4252-7922-4d3a-880e-a93cf37d7e3a_one-white-sneaker-shoe-isolated-white_93675-134695.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9b8d4252-7922-4d3a-880e-a93cf37d7e3a_one-white-sneaker-shoe-isolated-white_93675-134695.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (2, 'product/f5d68121-8cd5-4c97-9761-bd01d2f85500_white-sneakers-woman-model_53876-97149.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f5d68121-8cd5-4c97-9761-bd01d2f85500_white-sneakers-woman-model_53876-97149.jpg', 2);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (1, 'product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (1, 'product/c8670bba-ce02-4d70-83c4-73490c54937e_pink-tote-shopping-bag-with-blank-space_53876-102026.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/c8670bba-ce02-4d70-83c4-73490c54937e_pink-tote-shopping-bag-with-blank-space_53876-102026.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (1, 'product/eb82eb12-4252-48c3-b458-854eefd16210_still-life-hanging-bag_23-2151008976.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/eb82eb12-4252-48c3-b458-854eefd16210_still-life-hanging-bag_23-2151008976.jpg', 2);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (1, 'product/32c08527-5cc0-43ab-a2f0-81e303f9e8b8_still-life-hanging-bag_23-2151008988.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/32c08527-5cc0-43ab-a2f0-81e303f9e8b8_still-life-hanging-bag_23-2151008988.jpg', 3);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (1, 'product/eecc3f52-0190-4894-9293-c2de1f24ed0c_woman-holding-yellow-tote-bag-her-hand_53876-145634.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/eecc3f52-0190-4894-9293-c2de1f24ed0c_woman-holding-yellow-tote-bag-her-hand_53876-145634.jpg', 4);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (7, 'product/508c1dd9-d099-4a31-9754-4920cce837b3_engin-akyurt-ahs1R32GG9Y-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/508c1dd9-d099-4a31-9754-4920cce837b3_engin-akyurt-ahs1R32GG9Y-unsplash.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (7, 'product/6ed54a44-af4d-49ae-9666-b10622bf3023_jason-leung-EtOMMg1nSR8-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/6ed54a44-af4d-49ae-9666-b10622bf3023_jason-leung-EtOMMg1nSR8-unsplash.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (7, 'product/9deb1ffe-d2d3-4853-a965-a612eba6e28f_mnz-m1m2EZOZVwA-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9deb1ffe-d2d3-4853-a965-a612eba6e28f_mnz-m1m2EZOZVwA-unsplash.jpg', 2);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (8, 'product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (8, 'product/43391bd1-51fc-4025-8a7e-aa9a5599df87_lea-ochel-nsRBbE6-YLs-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/43391bd1-51fc-4025-8a7e-aa9a5599df87_lea-ochel-nsRBbE6-YLs-unsplash.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (9, 'product/e429c5bc-8505-4b96-a80e-171992f3e376_kemal-alkan-_BDBEP0ePQc-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/e429c5bc-8505-4b96-a80e-171992f3e376_kemal-alkan-_BDBEP0ePQc-unsplash.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (9, 'product/16580050-2f10-416b-9ba4-412e98e0ac92_kai-gabriel-2s3GhhJz2uY-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/16580050-2f10-416b-9ba4-412e98e0ac92_kai-gabriel-2s3GhhJz2uY-unsplash.jpg', 1);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (9, 'product/3748384d-dc40-4cf4-8367-dd6093d0ed85_jason-leung-EtOMMg1nSR8-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/3748384d-dc40-4cf4-8367-dd6093d0ed85_jason-leung-EtOMMg1nSR8-unsplash.jpg', 2);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (10, 'product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (10, 'product/0af2da98-3833-4766-b846-817c86cb7a67_patrik-velich-AgZc04zHJ-Y-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/0af2da98-3833-4766-b846-817c86cb7a67_patrik-velich-AgZc04zHJ-Y-unsplash.jpg', 1);



create table tbl_color_tag
(
    id         bigint auto_increment
        primary key,
    color      varchar(255) null,
    text       varchar(255) null,
    product_id bigint       null,
    constraint FKcqi4pxvfqeyah7bsuewbnw6m5
        foreign key (product_id) references tbl_product (pno)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#00ff73', 'green', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fcff00', 'yellow', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0b01f4', 'blue', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#07ff3a', 'green', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fdff02', 'yellow', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff03b5', 'pink', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#6100ff', 'purple', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fcff00', 'yellow', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#00ff73', 'green', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ffffff', 'white', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fcff00', 'yellow', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0b01f4', 'blue', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#07ff3a', 'green', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fdff02', 'yellow', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff03b5', 'pink', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#6100ff', 'purple', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0e09ff', 'blu', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#e30aff', 'pink', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0e09ff', 'blu', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#e30aff', 'pink', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#06ff00', 'green', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#9ea29d', 'gray', null);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#06ff00', 'green', 6);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#9ea29d', 'gray', 6);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', 5);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0e09ff', 'blu', 5);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#e30aff', 'pink', 5);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', 4);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff03b5', 'pink', 4);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#6100ff', 'purple', 4);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0b01f4', 'blue', 3);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', 3);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#07ff3a', 'green', 3);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fdff02', 'yellow', 3);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#00ff73', 'green', 2);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ffffff', 'white', 2);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', 1);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#fcff00', 'yellow', 1);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000aff', 'blue', 7);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', 7);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#00ff6c', 'green', 7);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#f30000', 'red', 8);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#0020f2', 'blue', 8);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', 8);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#c9c9c9', 'gray', 8);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', 9);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff00f0', 'pink', 9);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#7e00ff', 'purple', 9);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#00d0ff', 'skyblue', 9);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#000000', 'black', 10);
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES ('#ff0000', 'red', 10);



create table tbl_order
(
    id            bigint auto_increment
        primary key,
    created_at    datetime(6)  null,
    updated_at    datetime(6)  null,
    address       varchar(255) null,
    message       varchar(255) null,
    phone         varchar(255) null,
    receiver      varchar(255) null,
    zip_code      varchar(255) null,
    order_id      varchar(255) null,
    pname         varchar(255) null,
    pno           bigint       null,
    price         bigint       null,
    qty           int          not null,
    size          varchar(255) null,
    thumbnail_url varchar(255) null,
    shipping_fee  int          not null,
    status        tinyint      null
        check (`status` between 0 and 8),
    tax           int          not null,
    total_amount  int          not null,
    member_owner  varchar(255) null,
    color_id      bigint       null,
    member_seller varchar(255) null,
    payment_id    bigint       null,
    constraint FK9hi7ee9ie9g5b3gl1wojlaiix
        foreign key (payment_id) references tbl_payment (id),
    constraint FKh3u1s2xeuavndib8eoo1vm8t8
        foreign key (color_id) references tbl_color_tag (id),
    constraint FKk81x5d8ow20kj9n01ye3w944t
        foreign key (member_owner) references member (email),
    constraint FKlfw5r6lmcliepoxoekjqqccnh
        foreign key (member_seller) references member (email)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-27 23:49:07.209828', '2025-02-27 23:50:37.637059', '영등포', '123', '123', '함영은', '07247', 'u2wpgb1wbp', 'Product1', 1, 12000, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/92daea48-57ea-4dfb-a753-420677abfcb4_image.png', 3500, 1, 775, 16275, 'user1@aaa.com', 1, 'user1@aaa.com', 1);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 00:24:43.872991', '2025-02-28 00:25:14.721507', '영등포', '123', '123', '함영은', '07247', 'eegy5wh642q', 'Product1', 1, 12000, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/92daea48-57ea-4dfb-a753-420677abfcb4_image.png', 3500, 1, 1975, 41475, 'user1@aaa.com', 1, 'user1@aaa.com', 2);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 00:24:43.874997', '2025-02-28 00:25:14.728805', '영등포', '123', '123', '함영은', '07247', 'eegy5wh642q', 'Product2', 2, 12000, 2, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/0e60f6c1-cb51-408b-ba2d-4f1b7ca3eea7_landscape-desktop-wallpaper.jpg', 3500, 1, 1975, 41475, 'user1@aaa.com', 2, 'user1@aaa.com', 2);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.167922', '2025-02-28 17:34:03.237237', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '좋은 short sleeves', 5, 15800, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/2d547579-46ea-4e08-b7e5-ed8764e8497d_man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 38, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.173910', '2025-02-28 17:34:03.263835', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '멋진 Sport item', 6, 20000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/fe0796bb-b6d1-4203-8efd-5a15df2d27b9_sporty-woman-carrying-blue-duffle-bag-gym-essentials-studio-shoot_53876-104988.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 39, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.174910', '2025-02-28 17:34:03.270125', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '비싸고 좋은 Bag', 1, 12000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 3, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.175334', '2025-02-28 17:34:03.279832', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', 'Nice woman dress', 3, 12500, 1, 'M', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/be1bcd38-b96e-44e8-b6fb-cccc7e7afe98_1705649353000-Btpm4F.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 8, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.175334', '2025-02-28 17:34:03.279832', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '굿 퀄리티 White Shirts', 4, 5000, 1, '2XL', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/0334ab8c-d8b2-482c-9893-af28853c6883_simple-white-crew-neck-unisex-streetwear-apparel_53876-123185.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 9, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.175334', '2025-02-28 17:34:03.279832', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '비싸고 좋은 Bag', 1, 12000, 1, 'L', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 3, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 17:33:25.175334', '2025-02-28 17:34:03.279832', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '비싸고 좋은 Bag', 1, 12000, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 1, 'user1@aaa.com', 3);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 21:02:11.810300', '2025-02-28 21:02:45.928928', '영등포', '경비실에 두고가주세요.', '1111111', 'HWEWON', '07247', '78ktbzfkrqa', '여성 반팔티', 10, 55400, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 68, 'user2@aaa.com', 4);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 21:02:11.813285', '2025-02-28 21:02:45.938620', '영등포', '경비실에 두고가주세요.', '1111111', 'HWEWON', '07247', '78ktbzfkrqa', '방수 블랙 재킷', 8, 555000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 60, 'user2@aaa.com', 4);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 22:10:01.682707', '2025-02-28 22:10:35.753065', '여의도', '문 앞 부탁드려요 ', '12312312', 'Jane Doe', '123123', 'hgdb2sq57le', '여성 반팔티', 10, 55400, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 68, 'user2@aaa.com', 5);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 22:10:01.688236', '2025-02-28 22:10:35.758933', '여의도', '문 앞 부탁드려요 ', '12312312', 'Jane Doe', '123123', 'hgdb2sq57le', '방수 블랙 재킷', 8, 555000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 60, 'user2@aaa.com', 5);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 22:14:30.696874', '2025-02-28 22:15:08.936607', '사천', '문 앞 부탁드립니다.', '123123', 'Jungook', '123123', 'f8orvy9vthp', '여성 반팔티', 10, 55400, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 68, 'user2@aaa.com', 6);
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES ('2025-02-28 22:14:30.698179', '2025-02-28 22:15:08.948941', '사천', '문 앞 부탁드립니다.', '123123', 'Jungook', '123123', 'f8orvy9vthp', '방수 블랙 재킷', 8, 555000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 60, 'user2@aaa.com', 6);



    create table product_size_list
(
    product_pno bigint       not null,
    size_list   varchar(255) null,
    constraint FKebo33vum2b33xe71t95kncyoy
        foreign key (product_pno) references tbl_product (pno)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (6, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (6, 'L');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (6, '2XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (6, '3XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (5, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (5, 'XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (5, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (5, 'FREE');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (5, '3XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (4, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (4, 'L');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (4, '2XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (3, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (3, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (3, 'L');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (2, 'XS');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (2, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (1, 'L');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (1, 'FREE');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (1, '2XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (1, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (1, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (1, 'XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (7, 'FREE');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (7, 'XS');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (7, '2XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (7, '3XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, 'XS');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, 'XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, 'L');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, '3XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (8, 'FREE');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, 'XS');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, 'L');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, 'XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, '2XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, '3XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (9, 'FREE');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (10, 'XS');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (10, 'S');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (10, 'M');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (10, '3XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (10, '2XL');
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES (10, 'FREE');


create table tbl_cart
(
    cno          bigint auto_increment
        primary key,
    member_owner varchar(255) null,
    constraint UK_4x59g5i516ao54rb4tnf1x85d
        unique (member_owner),
    constraint FK4pvmyvyqisuytcxntao9kimj7
        foreign key (member_owner) references member (email)
)
    collate = utf8mb4_general_ci;

create index idx_cart_email
    on tbl_cart (member_owner);

INSERT INTO apidb.tbl_cart (member_owner) VALUES ('user1@aaa.com');
INSERT INTO apidb.tbl_cart (member_owner) VALUES ('user2@aaa.com');


create table tbl_cart_item
(
    cino          bigint auto_increment
        primary key,
    qty           int          not null,
    size          varchar(255) null,
    cart_cno      bigint       null,
    color_id      bigint       null,
    product_pno   bigint       null,
    member_seller varchar(255) null,
    constraint FKem31i0jytusbded0v2wvnntyw
        foreign key (cart_cno) references tbl_cart (cno),
    constraint FKlsgw78tsc9ttlupegjqjle9wk
        foreign key (member_seller) references member (email),
    constraint FKr6uyw4bbjis2mv6nm18oedndp
        foreign key (color_id) references tbl_color_tag (id),
    constraint FKs7vg62w3nq7igdxgssq1u0biw
        foreign key (product_pno) references tbl_product (pno)
)
    collate = utf8mb4_general_ci;

create index idx_cartitem_cart
    on tbl_cart_item (cart_cno);

create index idx_cartitem_pno_cart
    on tbl_cart_item (product_pno, cart_cno);


INSERT INTO apidb.tbl_cart_item (qty, size, cart_cno, color_id, product_pno, member_seller) VALUES (2, 'S', 1, 49, 3, 'user1@aaa.com');
INSERT INTO apidb.tbl_cart_item (qty, size, cart_cno, color_id, product_pno, member_seller) VALUES (1, 'L', 1, 51, 3, 'user1@aaa.com');
INSERT INTO apidb.tbl_cart_item (qty, size, cart_cno, color_id, product_pno, member_seller) VALUES (1, 'S', 2, 49, 3, 'user1@aaa.com');
INSERT INTO apidb.tbl_cart_item (qty, size, cart_cno, color_id, product_pno, member_seller) VALUES (1, 'XS', 2, 68, 10, 'user2@aaa.com');



create table tbl_review
(
    rno          bigint auto_increment
        primary key,
    created_at   datetime(6)  null,
    updated_at   datetime(6)  null,
    content      varchar(255) null,
    order_id     varchar(255) null,
    rating       int          not null,
    oid          bigint       null,
    member_owner varchar(255) null,
    product_id   bigint       null,
    constraint UK_ayvtki6o7v3we6hficu1bx02c
        unique (oid),
    constraint FKa12qg0difn0jw3m9puletyuxx
        foreign key (product_id) references tbl_product (pno),
    constraint FKbpttk4apjd74vnskv5gyr056t
        foreign key (member_owner) references member (email),
    constraint FKnbgpjjqfg4r71hrv4lui41ngd
        foreign key (oid) references tbl_order (id)
)
    collate = utf8mb4_general_ci;

INSERT INTO apidb.tbl_review (created_at, updated_at, content, order_id, rating, oid, member_owner, product_id) VALUES ('2025-02-28 11:10:03.123487', '2025-02-28 11:10:03.123487', 'GOOD!', 'eegy5wh642q', 5, 2, 'user1@aaa.com', 1);
INSERT INTO apidb.tbl_review (created_at, updated_at, content, order_id, rating, oid, member_owner, product_id) VALUES ('2025-02-28 15:58:20.580447', '2025-02-28 15:58:20.580447', 'So so...', 'eegy5wh642q', 3, 3, 'user1@aaa.com', 2);


create table tbl_todo
(
    tno      bigint auto_increment
        primary key,
    complete bit          not null,
    content  varchar(255) null,
    due_date date         null,
    title    varchar(500) not null,
    writer   varchar(255) null
)
    collate = utf8mb4_general_ci;