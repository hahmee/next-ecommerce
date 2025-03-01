-- 1. 데이터베이스 및 사용자 생성
CREATE DATABASE IF NOT EXISTS apidb;
USE apidb;

-- 사용자 생성 (비밀번호는 환경변수에서 설정한 값을 사용)
CREATE USER IF NOT EXISTS 'apidbuser'@'localhost' IDENTIFIED BY 'apidbuser';
CREATE USER IF NOT EXISTS 'apidbuser'@'%' IDENTIFIED BY 'apidbuser';

-- 사용자에게 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON apidb.* TO 'apidbuser'@'localhost';
GRANT ALL PRIVILEGES ON apidb.* TO 'apidbuser'@'%';

-- 권한 적용
FLUSH PRIVILEGES;

---------------------------------------------------------------------------
-- 2. 기본 테이블 (참조의 시작) : member 및 관련 테이블
---------------------------------------------------------------------------

-- member 테이블 생성 및 데이터 삽입
CREATE TABLE member
(
    email        VARCHAR(255) NOT NULL PRIMARY KEY,
    nickname     VARCHAR(255) NULL,
    password     VARCHAR(255) NULL,
    social       BIT          NOT NULL,
    encrypted_id VARCHAR(255) NULL
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES 
  ('test@aaa.com', 'test', '$2a$10$341QUdzBCf.GmpLo17nH5uTIkYPCE5QYcP2fkyicbBVEL.a430QdW', FALSE, '48abe7b514cc616d5c92efb36c1777e9ca63ab840aab25a722da63cce8549965'),
  ('user1@aaa.com', 'USER1', '$2a$10$jnhB3L2L0my4QQoq6ANkKua4mtKGG1XHNBeGlJHuoGMsxcxh2Mb4S', FALSE, NULL),
  ('user2@aaa.com', 'USER2', '$2a$10$Im2GAgKbMUKHXoOXK3dZAeTeUpdkTEG78cM6drco/36GKoHmPc1IG', FALSE, NULL),
  ('user3@aaa.com', 'USER3', '$2a$10$JmLOnSrs0Z5QacwkMsai5eDMQV55kBjmhyAYo/wXEKffD9MGuwj06', FALSE, NULL),
  ('user4@aaa.com', 'USER4', '$2a$10$uNOBz/6vYpvrgoNxbJdMdOprD9A1jDTQlza3rn2nfLeEoA/7jf2sO', FALSE, NULL),
  ('user5@aaa.com', 'USER5', '$2a$10$XXiBmLu2kiGuYfTZh.wSi.VmOBssgYuKrZw/Q2VObTVl1YbLsDf0.', FALSE, NULL),
  ('user6@aaa.com', 'USER6', '$2a$10$cWumMVXmXrNzR4RVkSptmuc6pRLQuE7h0bZYOOgvgrQ6tgM23fd6S', FALSE, NULL),
  ('user7@aaa.com', 'USER7', '$2a$10$lb6Lw7uhJZQuGk7tyONpHOrnMGDfEHZOVhtCI3W4iyIPzGYUvtoCC', FALSE, NULL),
  ('user8@aaa.com', 'USER8', '$2a$10$JzV7MwHQL1oi0H.91c8FSuRI8yDgB92s/8jnFHoMad8vOTmv/cMWO', FALSE, NULL),
  ('user9@aaa.com', 'USER9', '$2a$10$mvxa85LaAKv6n72WHmaq5.eagqUZbr6TxK/FNR4/TbtoXQyykJI5q', FALSE, NULL);

-- member_member_role_list 테이블 생성 및 데이터 삽입
CREATE TABLE member_member_role_list
(
    member_email     VARCHAR(255) NOT NULL,
    member_role_list TINYINT      NULL CHECK (`member_role_list` BETWEEN 0 AND 2),
    CONSTRAINT FK2cojwm6nbbasi0xkedqjjagap FOREIGN KEY (member_email) REFERENCES member (email)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES 
  ('user1@aaa.com', 2),
  ('user2@aaa.com', 2),
  ('test@aaa.com', 0),
  ('user3@aaa.com', 2),
  ('user4@aaa.com', 1),
  ('user5@aaa.com', 1),
  ('user6@aaa.com', 1),
  ('user7@aaa.com', 1),
  ('user8@aaa.com', 1),
  ('user9@aaa.com', 1);

---------------------------------------------------------------------------
-- 3. 카테고리 관련 테이블: tbl_category, tbl_product, tbl_color_tag
---------------------------------------------------------------------------

-- tbl_category 생성 및 데이터 삽입
CREATE TABLE tbl_category
(
    cno        BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(6)  NULL,
    updated_at DATETIME(6)  NULL,
    cdesc      VARCHAR(255) NULL,
    cname      VARCHAR(255) NULL,
    del_flag   BIT          NOT NULL,
    file_key   VARCHAR(255) NULL,
    file_name  VARCHAR(255) NULL
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES 
  ('2025-02-27 23:26:02.988972', '2025-02-28 17:21:39.021816', 'category1', '카테고리1', FALSE, 'category/f32d3517-3ec3-4792-a16b-2d359a850de7_annie-spratt-qyAka7W5uMY-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/f32d3517-3ec3-4792-a16b-2d359a850de7_annie-spratt-qyAka7W5uMY-unsplash.jpg'),
  ('2025-02-27 23:26:27.151694', '2025-02-28 17:21:51.462641', 'subCategory1-1', '카테고리1-1', FALSE, 'category/760ea912-9c38-46a8-af22-9c2c9343a45b_daria-nepriakhina-xY55bL5mZAM-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/760ea912-9c38-46a8-af22-9c2c9343a45b_daria-nepriakhina-xY55bL5mZAM-unsplash.jpg'),
  ('2025-02-27 23:27:05.954157', '2025-02-28 17:21:34.450794', 'category2', '카테고리2', FALSE, 'category/29e5c490-8fef-496d-81b0-8ab4fc8a6243_firmbee-com-SpVHcbuKi6E-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/29e5c490-8fef-496d-81b0-8ab4fc8a6243_firmbee-com-SpVHcbuKi6E-unsplash.jpg'),
  ('2025-02-28 16:00:05.943541', '2025-02-28 17:21:56.650815', 'subCategory1-2', '카테고리1-2', FALSE, 'category/c3b16252-4922-486f-bf91-132dbd22d783_NEWYORK.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/c3b16252-4922-486f-bf91-132dbd22d783_NEWYORK.jpg'),
  ('2025-02-28 16:00:38.285137', '2025-02-28 17:21:45.884725', 'subCategory2-2', '카테고리2-2', FALSE, 'category/5cc6ab85-499b-4a9b-ae80-6cb39ae9c5a6_sincerely-media-nGrfKmtwv24-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/5cc6ab85-499b-4a9b-ae80-6cb39ae9c5a6_sincerely-media-nGrfKmtwv24-unsplash.jpg'),
  ('2025-02-28 16:01:05.240311', '2025-02-28 17:21:30.082312', 'category3', '카테고리3', FALSE, 'category/3dc6e333-3eb5-412d-8ee2-7365199b935b_sven-d-a4S6KUuLeoM-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/3dc6e333-3eb5-412d-8ee2-7365199b935b_sven-d-a4S6KUuLeoM-unsplash.jpg'),
  ('2025-02-28 16:01:14.250236', '2025-02-28 17:21:25.866749', 'category4', '카테고리4', FALSE, 'category/2184ee10-af36-4a7e-bdb1-0abd39482384_mediamodifier-elbKS4DY21g-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/2184ee10-af36-4a7e-bdb1-0abd39482384_mediamodifier-elbKS4DY21g-unsplash.jpg'),
  ('2025-02-28 16:01:44.993172', '2025-02-28 17:31:38.307731', 'subCategory1-1-1', '서브카테고리1-1-1', FALSE, 'category/14bbd0dd-1098-41cf-b582-9e375ea1fcb2_KakaoTalk_20241008_144033593.png', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/14bbd0dd-1098-41cf-b582-9e375ea1fcb2_KakaoTalk_20241008_144033593.png');

-- tbl_product 생성 및 데이터 삽입 (tbl_category와 member 참조)
CREATE TABLE tbl_product
(
    pno            BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at     DATETIME(6)  NULL,
    updated_at     DATETIME(6)  NULL,
    change_policy  VARCHAR(255) NULL,
    del_flag       BIT          NOT NULL,
    pdesc          VARCHAR(255) NULL,
    pname          VARCHAR(255) NULL,
    price          BIGINT       NULL,
    refund_policy  VARCHAR(255) NULL,
    sales_status   TINYINT      NULL CHECK (`sales_status` BETWEEN 0 AND 2),
    sku            VARCHAR(255) NULL,
    admin_category BIGINT       NULL,
    member_owner   VARCHAR(255) NULL,
    CONSTRAINT FK25sphjrqy9564f68j5cc2rcb2 FOREIGN KEY (member_owner) REFERENCES member (email),
    CONSTRAINT FKs8hga2mxmtge74loayofk62u8 FOREIGN KEY (admin_category) REFERENCES tbl_category (cno)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES 
  ('2025-02-27 23:48:38.226118', '2025-02-28 17:22:58.386971', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis</p>', '비싸고 좋은 Bag', 12000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku', 2, 'user1@aaa.com'),
  ('2025-02-28 00:15:37.530526', '2025-02-28 17:22:49.688382', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '새로운 Shoes', 12000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku', 3, 'user1@aaa.com'),
  ('2025-02-28 16:03:48.806901', '2025-02-28 17:22:40.971132', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', 'Nice woman dress', 12500, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku', 8, 'user1@aaa.com'),
  ('2025-02-28 16:06:04.443754', '2025-02-28 17:22:35.465728', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '굿 퀄리티 White Shirts', 5000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 1, 'wlekfasdf', 6, 'user1@aaa.com'),
  ('2025-02-28 17:13:11.678346', '2025-02-28 17:22:28.469064', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '좋은 short sleeves', 15800, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku', 8, 'user1@aaa.com'),
  ('2025-02-28 17:15:09.366805', '2025-02-28 17:22:20.753369', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '멋진 Sport item', 20000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku-asdfasdf', 7, 'user1@aaa.com'),
  ('2025-02-28 17:26:05.044278', '2025-02-28 17:26:05.044278', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p>', '질긴 청바지', 19996, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku-23123', 4, 'user2@aaa.com'),
  ('2025-02-28 17:27:29.557238', '2025-02-28 17:27:29.557238', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p><span class="ql-cursor">﻿</span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '방수 블랙 재킷', 555000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku-123123', 7, 'user2@aaa.com'),
  ('2025-02-28 17:28:43.361173', '2025-02-28 17:28:43.361173', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '예쁜 바지', 555000, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku-5454', 6, 'user2@aaa.com'),
  ('2025-02-28 17:30:36.199663', '2025-02-28 17:30:36.199663', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', FALSE, '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&nbsp;&nbsp;</p><p><br></p>', '여성 반팔티', 55400, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', 0, 'sku-1231', 8, 'user2@aaa.com');

-- tbl_color_tag 생성 및 데이터 삽입 (tbl_product 참조)
CREATE TABLE tbl_color_tag
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    color      VARCHAR(255) NULL,
    text       VARCHAR(255) NULL,
    product_id BIGINT       NULL,
    CONSTRAINT FKcqi4pxvfqeyah7bsuewbnw6m5 FOREIGN KEY (product_id) REFERENCES tbl_product (pno)
)
    COLLATE = utf8mb4_general_ci;

-- (아래 INSERT 구문은 product_id가 NULL인 경우와 특정 제품 번호를 참조하는 경우를 포함)
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES 
  ('#ff0000', 'red', NULL),
  ('#00ff73', 'green', NULL),
  ('#ff0000', 'red', NULL),
  ('#fcff00', 'yellow', NULL),
  ('#0b01f4', 'blue', NULL),
  ('#000000', 'black', NULL),
  ('#07ff3a', 'green', NULL),
  ('#fdff02', 'yellow', NULL),
  ('#000000', 'black', NULL),
  ('#ff03b5', 'pink', NULL),
  ('#6100ff', 'purple', NULL),
  ('#ff0000', 'red', NULL),
  ('#fcff00', 'yellow', NULL),
  ('#00ff73', 'green', NULL),
  ('#ffffff', 'white', NULL),
  ('#ff0000', 'red', NULL),
  ('#fcff00', 'yellow', NULL),
  ('#0b01f4', 'blue', NULL),
  ('#000000', 'black', NULL),
  ('#07ff3a', 'green', NULL),
  ('#fdff02', 'yellow', NULL),
  ('#000000', 'black', NULL),
  ('#ff03b5', 'pink', NULL),
  ('#6100ff', 'purple', NULL),
  ('#000000', 'black', NULL),
  ('#0e09ff', 'blu', NULL),
  ('#e30aff', 'pink', NULL),
  ('#000000', 'black', NULL),
  ('#0e09ff', 'blu', NULL),
  ('#e30aff', 'pink', NULL),
  ('#06ff00', 'green', NULL),
  ('#9ea29d', 'gray', NULL),
  ('#06ff00', 'green', 6),
  ('#9ea29d', 'gray', 6),
  ('#000000', 'black', 5),
  ('#0e09ff', 'blu', 5),
  ('#e30aff', 'pink', 5),
  ('#000000', 'black', 4),
  ('#ff03b5', 'pink', 4),
  ('#6100ff', 'purple', 4),
  ('#0b01f4', 'blue', 3),
  ('#000000', 'black', 3),
  ('#07ff3a', 'green', 3),
  ('#fdff02', 'yellow', 3),
  ('#00ff73', 'green', 2),
  ('#ffffff', 'white', 2),
  ('#ff0000', 'red', 1),
  ('#fcff00', 'yellow', 1),
  ('#000aff', 'blue', 7),
  ('#000000', 'black', 7),
  ('#00ff6c', 'green', 7),
  ('#f30000', 'red', 8),
  ('#0020f2', 'blue', 8),
  ('#000000', 'black', 8),
  ('#c9c9c9', 'gray', 8),
  ('#ff0000', 'red', 9),
  ('#ff00f0', 'pink', 9),
  ('#7e00ff', 'purple', 9),
  ('#00d0ff', 'skyblue', 9),
  ('#000000', 'black', 10),
  ('#ff0000', 'red', 10);

---------------------------------------------------------------------------
-- 4. 장바구니 관련 테이블: tbl_cart, tbl_cart_item
---------------------------------------------------------------------------

-- tbl_cart 생성 및 데이터 삽입
CREATE TABLE tbl_cart
(
    cno          BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_owner VARCHAR(255) NULL,
    CONSTRAINT UK_4x59g5i516ao54rb4tnf1x85d UNIQUE (member_owner),
    CONSTRAINT FK4pvmyvyqisuytcxntao9kimj7 FOREIGN KEY (member_owner) REFERENCES member (email)
)
    COLLATE = utf8mb4_general_ci;

CREATE INDEX idx_cart_email ON tbl_cart (member_owner);

INSERT INTO apidb.tbl_cart (member_owner) VALUES ('user1@aaa.com');
INSERT INTO apidb.tbl_cart (member_owner) VALUES ('user2@aaa.com');

-- tbl_cart_item 생성 및 데이터 삽입
CREATE TABLE tbl_cart_item
(
    cino          BIGINT AUTO_INCREMENT PRIMARY KEY,
    qty           INT          NOT NULL,
    size          VARCHAR(255) NULL,
    cart_cno      BIGINT       NULL,
    color_id      BIGINT       NULL,
    product_pno   BIGINT       NULL,
    member_seller VARCHAR(255) NULL,
    CONSTRAINT FKem31i0jytusbded0v2wvnntyw FOREIGN KEY (cart_cno) REFERENCES tbl_cart (cno),
    CONSTRAINT FKlsgw78tsc9ttlupegjqjle9wk FOREIGN KEY (member_seller) REFERENCES member (email),
    CONSTRAINT FKr6uyw4bbjis2mv6nm18oedndp FOREIGN KEY (color_id) REFERENCES tbl_color_tag (id),
    CONSTRAINT FKs7vg62w3nq7igdxgssq1u0biw FOREIGN KEY (product_pno) REFERENCES tbl_product (pno)
)
    COLLATE = utf8mb4_general_ci;

CREATE INDEX idx_cartitem_cart ON tbl_cart_item (cart_cno);
CREATE INDEX idx_cartitem_pno_cart ON tbl_cart_item (product_pno, cart_cno);

INSERT INTO apidb.tbl_cart_item (qty, size, cart_cno, color_id, product_pno, member_seller) VALUES 
  (2, 'S', 1, 49, 3, 'user1@aaa.com'),
  (1, 'L', 1, 51, 3, 'user1@aaa.com'),
  (1, 'S', 2, 49, 3, 'user1@aaa.com'),
  (1, 'XS', 2, 68, 10, 'user2@aaa.com');

---------------------------------------------------------------------------
-- 5. 제품 이미지 및 사이즈 관련 테이블: product_image_list, product_size_list
---------------------------------------------------------------------------

-- product_image_list 생성 및 데이터 삽입 (tbl_product 참조)
CREATE TABLE product_image_list
(
    product_pno BIGINT       NOT NULL,
    file_key    VARCHAR(255) NULL,
    file_name   VARCHAR(255) NULL,
    ord         INT          NOT NULL,
    CONSTRAINT FKfqvvs4dg13jiki1fur4s3qa43 FOREIGN KEY (product_pno) REFERENCES tbl_product (pno)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES 
  (6, 'product/fe0796bb-b6d1-4203-8efd-5a15df2d27b9_sporty-woman-carrying-blue-duffle-bag-gym-essentials-studio-shoot_53876-104988.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/fe0796bb-b6d1-4203-8efd-5a15df2d27b9_sporty-woman-carrying-blue-duffle-bag-gym-essentials-studio-shoot_53876-104988.jpg', 0),
  (6, 'product/6c47a9b1-64e5-4fee-bbe1-7a183fad5b98_view-trucker-hat-with-badminton-set_23-2149410093.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/6c47a9b1-64e5-4fee-bbe1-7a183fad5b98_view-trucker-hat-with-badminton-set_23-2149410093.jpg', 1),
  (5, 'product/2d547579-46ea-4e08-b7e5-ed8764e8497d_man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/2d547579-46ea-4e08-b7e5-ed8764e8497d_man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg', 0),
  (5, 'product/875dc8b8-9a48-4754-985f-bcff87236abc_man-wearing-basic-gray-polo-shirt-apparel_53876-102221.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/875dc8b8-9a48-4754-985f-bcff87236abc_man-wearing-basic-gray-polo-shirt-apparel_53876-102221.jpg', 1),
  (5, 'product/6fe44e37-05af-4bb7-97b6-e177dc62295e_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/6fe44e37-05af-4bb7-97b6-e177dc62295e_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 2),
  (4, 'product/0334ab8c-d8b2-482c-9893-af28853c6883_simple-white-crew-neck-unisex-streetwear-apparel_53876-123185.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/0334ab8c-d8b2-482c-9893-af28853c6883_simple-white-crew-neck-unisex-streetwear-apparel_53876-123185.jpg', 0),
  (4, 'product/d927dfd5-4144-40a9-bc8c-375de8d5c7c1_man-wearing-white-sweater-close-up-rear-view_53876-128791.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/d927dfd5-4144-40a9-bc8c-375de8d5c7c1_man-wearing-white-sweater-close-up-rear-view_53876-128791.jpg', 1),
  (4, 'product/4a40ac2f-b80d-48e3-9192-37d676f94201_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/4a40ac2f-b80d-48e3-9192-37d676f94201_woman-white-long-sleeve-tee-men-s-fashion-studio-portrait_53876-104312.jpg', 2),
  (3, 'product/be1bcd38-b96e-44e8-b6fb-cccc7e7afe98_1705649353000-Btpm4F.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/be1bcd38-b96e-44e8-b6fb-cccc7e7afe98_1705649353000-Btpm4F.jpg', 0),
  (3, 'product/1e4e2d5b-2435-470f-9a52-a8133761bcc6_1705392906000-42mkpA.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/1e4e2d5b-2435-470f-9a52-a8133761bcc6_1705392906000-42mkpA.jpg', 1),
  (2, 'product/a2358edf-e8da-43b3-9af5-8162d645588a_new-pair-white-sneakers-isolated-white_93675-126299.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/a2358edf-e8da-43b3-9af5-8162d645588a_new-pair-white-sneakers-isolated-white_93675-126299.jpg', 0),
  (2, 'product/9b8d4252-7922-4d3a-880e-a93cf37d7e3a_one-white-sneaker-shoe-isolated-white_93675-134695.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9b8d4252-7922-4d3a-880e-a93cf37d7e3a_one-white-sneaker-shoe-isolated-white_93675-134695.jpg', 1),
  (2, 'product/f5d68121-8cd5-4c97-9761-bd01d2f85500_white-sneakers-woman-model_53876-97149.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f5d68121-8cd5-4c97-9761-bd01d2f85500_white-sneakers-woman-model_53876-97149.jpg', 2),
  (1, 'product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 0),
  (1, 'product/c8670bba-ce02-4d70-83c4-73490c54937e_pink-tote-shopping-bag-with-blank-space_53876-102026.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/c8670bba-ce02-4d70-83c4-73490c54937e_pink-tote-shopping-bag-with-blank-space_53876-102026.jpg', 1),
  (1, 'product/eb82eb12-4252-48c3-b458-854eefd16210_still-life-hanging-bag_23-2151008976.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/eb82eb12-4252-48c3-b458-854eefd16210_still-life-hanging-bag_23-2151008976.jpg', 2),
  (1, 'product/32c08527-5cc0-43ab-a2f0-81e303f9e8b8_still-life-hanging-bag_23-2151008988.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/32c08527-5cc0-43ab-a2f0-81e303f9e8b8_still-life-hanging-bag_23-2151008988.jpg', 3),
  (1, 'product/eecc3f52-0190-4894-9293-c2de1f24ed0c_woman-holding-yellow-tote-bag-her-hand_53876-145634.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/eecc3f52-0190-4894-9293-c2de1f24ed0c_woman-holding-yellow-tote-bag-her-hand_53876-145634.jpg', 4);

-- product_size_list 생성 및 데이터 삽입 (tbl_product 참조)
CREATE TABLE product_size_list
(
    product_pno BIGINT       NOT NULL,
    size_list   VARCHAR(255) NULL,
    CONSTRAINT FKebo33vum2b33xe71t95kncyoy FOREIGN KEY (product_pno) REFERENCES tbl_product (pno)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES 
  (6, 'S'),
  (6, 'L'),
  (6, '2XL'),
  (6, '3XL'),
  (5, 'S'),
  (5, 'XL'),
  (5, 'M'),
  (5, 'FREE'),
  (5, '3XL'),
  (4, 'M'),
  (4, 'L'),
  (4, '2XL'),
  (3, 'S'),
  (3, 'M'),
  (3, 'L'),
  (2, 'XS'),
  (2, 'S'),
  (1, 'L'),
  (1, 'FREE'),
  (1, '2XL'),
  (1, 'M'),
  (1, 'S'),
  (1, 'XL'),
  (7, 'FREE'),
  (7, 'XS'),
  (7, '2XL'),
  (7, '3XL'),
  (8, 'S'),
  (8, 'XS'),
  (8, 'XL'),
  (8, 'M'),
  (8, 'L'),
  (8, '3XL'),
  (8, 'FREE'),
  (9, 'XS'),
  (9, 'S'),
  (9, 'M'),
  (9, 'L'),
  (9, 'XL'),
  (9, '2XL'),
  (9, '3XL'),
  (9, 'FREE'),
  (10, 'XS'),
  (10, 'S'),
  (10, 'M'),
  (10, '3XL'),
  (10, '2XL'),
  (10, 'FREE');

---------------------------------------------------------------------------
-- 6. 카테고리 Closure 테이블
---------------------------------------------------------------------------

CREATE TABLE tbl_category_closure
(
    depth          INT    NOT NULL,
    descendant_cno BIGINT NOT NULL,
    ancestor_cno   BIGINT NOT NULL,
    PRIMARY KEY (ancestor_cno, descendant_cno),
    CONSTRAINT FK4ocjdplm8qkynki9xbv8u9ewa FOREIGN KEY (ancestor_cno) REFERENCES tbl_category (cno),
    CONSTRAINT FKtqmnhrab7f7o30ivo487p3ppv FOREIGN KEY (descendant_cno) REFERENCES tbl_category (cno)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES 
  (0, 1, 1),
  (1, 2, 1),
  (1, 4, 1),
  (2, 8, 1),
  (0, 2, 2),
  (1, 8, 2),
  (0, 3, 3),
  (1, 5, 3),
  (0, 4, 4),
  (0, 5, 5),
  (0, 6, 6),
  (0, 7, 7),
  (0, 8, 8);

---------------------------------------------------------------------------
-- 7. 결제 및 주문 관련 테이블: tbl_payment, tbl_order, tbl_order_payment
---------------------------------------------------------------------------

-- tbl_payment 생성 및 데이터 삽입 (member 참조)
CREATE TABLE tbl_payment
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at   DATETIME(6)  NULL,
    updated_at   DATETIME(6)  NULL,
    country      VARCHAR(255) NULL,
    method       TINYINT      NULL CHECK (`method` BETWEEN 0 AND 2),
    order_id     VARCHAR(255) NULL,
    order_name   VARCHAR(255) NULL,
    payment_key  VARCHAR(255) NULL,
    status       TINYINT      NULL CHECK (`status` BETWEEN 0 AND 7),
    total_amount INT          NOT NULL,
    type         TINYINT      NULL CHECK (`type` BETWEEN 0 AND 2),
    member_owner VARCHAR(255) NULL,
    CONSTRAINT FKe7v3apj7ter215xcr54xhbkwc FOREIGN KEY (member_owner) REFERENCES member (email)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES 
  ('2025-02-27 23:50:37.628792', '2025-02-27 23:50:37.628792', 'KR', 2, 'u2wpgb1wbp', 'Product1', 'tviva20250227234908E4dn5', 3, 16275, 0, 'user1@aaa.com'),
  ('2025-02-28 00:25:14.717991', '2025-02-28 00:25:14.717991', 'KR', 2, 'eegy5wh642q', 'Product1 외 1개', 'tviva20250228002445uJ1u2', 3, 41475, 0, 'user1@aaa.com'),
  ('2025-02-28 17:34:03.216548', '2025-02-28 17:34:03.216548', 'KR', 2, 'cn63g68bike', '좋은 short sleeves 외 6개', 'tviva20250228173327EgPH9', 3, 97440, 0, 'user1@aaa.com'),
  ('2025-02-28 21:02:45.922932', '2025-02-28 21:02:45.922932', 'KR', 2, '78ktbzfkrqa', '여성 반팔티 외 1개', 'tviva20250228210213q5TM8', 3, 640920, 0, 'user1@aaa.com'),
  ('2025-02-28 22:10:35.746542', '2025-02-28 22:10:35.746542', 'KR', 2, 'hgdb2sq57le', '여성 반팔티 외 1개', 'tviva20250228221003v9nJ7', 3, 640920, 0, 'user1@aaa.com'),
  ('2025-02-28 22:15:08.930605', '2025-02-28 22:15:08.930605', 'KR', 2, 'f8orvy9vthp', '여성 반팔티 외 1개', 'tviva20250228221432r5tv9', 3, 640920, 0, 'user2@aaa.com');

-- tbl_order 생성 및 데이터 삽입 (tbl_payment, tbl_color_tag, member 참조)
CREATE TABLE tbl_order
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at    DATETIME(6)  NULL,
    updated_at    DATETIME(6)  NULL,
    address       VARCHAR(255) NULL,
    message       VARCHAR(255) NULL,
    phone         VARCHAR(255) NULL,
    receiver      VARCHAR(255) NULL,
    zip_code      VARCHAR(255) NULL,
    order_id      VARCHAR(255) NULL,
    pname         VARCHAR(255) NULL,
    pno           BIGINT       NULL,
    price         BIGINT       NULL,
    qty           INT          NOT NULL,
    size          VARCHAR(255) NULL,
    thumbnail_url VARCHAR(255) NULL,
    shipping_fee  INT          NOT NULL,
    status        TINYINT      NULL CHECK (`status` BETWEEN 0 AND 8),
    tax           INT          NOT NULL,
    total_amount  INT          NOT NULL,
    member_owner  VARCHAR(255) NULL,
    color_id      BIGINT       NULL,
    member_seller VARCHAR(255) NULL,
    payment_id    BIGINT       NULL,
    CONSTRAINT FK9hi7ee9ie9g5b3gl1wojlaiix FOREIGN KEY (payment_id) REFERENCES tbl_payment (id),
    CONSTRAINT FKh3u1s2xeuavndib8eoo1vm8t8 FOREIGN KEY (color_id) REFERENCES tbl_color_tag (id),
    CONSTRAINT FKk81x5d8ow20kj9n01ye3w944t FOREIGN KEY (member_owner) REFERENCES member (email),
    CONSTRAINT FKlfw5r6lmcliepoxoekjqqccnh FOREIGN KEY (member_seller) REFERENCES member (email)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES 
  ('2025-02-27 23:49:07.209828', '2025-02-27 23:50:37.637059', '영등포', '123', '123', '함영은', '07247', 'u2wpgb1wbp', 'Product1', 1, 12000, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/92daea48-57ea-4dfb-a753-420677abfcb4_image.png', 3500, 1, 775, 16275, 'user1@aaa.com', 1, 'user1@aaa.com', 1),
  ('2025-02-28 00:24:43.872991', '2025-02-28 00:25:14.721507', '영등포', '123', '123', '함영은', '07247', 'eegy5wh642q', 'Product1', 1, 12000, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/92daea48-57ea-4dfb-a753-420677abfcb4_image.png', 3500, 1, 1975, 41475, 'user1@aaa.com', 1, 'user1@aaa.com', 2),
  ('2025-02-28 17:33:25.167922', '2025-02-28 17:34:03.237237', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '좋은 short sleeves', 5, 15800, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/2d547579-46ea-4e08-b7e5-ed8764e8497d_man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 38, 'user1@aaa.com', 3),
  ('2025-02-28 17:33:25.173910', '2025-02-28 17:34:03.263835', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '멋진 Sport item', 6, 20000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/fe0796bb-b6d1-4203-8efd-5a15df2d27b9_sporty-woman-carrying-blue-duffle-bag-gym-essentials-studio-shoot_53876-104988.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 39, 'user1@aaa.com', 3),
  ('2025-02-28 17:33:25.174910', '2025-02-28 17:34:03.270125', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '비싸고 좋은 Bag', 1, 12000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 3, 'user1@aaa.com', 3),
  ('2025-02-28 17:33:25.175334', '2025-02-28 17:34:03.279832', '영등포', '문 앞 부탁드려요', '123123', 'YoungEun', '123123', 'cn63g68bike', '비싸고 좋은 Bag', 1, 12000, 1, 'L', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/930e6424-b6e5-4f76-be0d-446ff377f114_back-view-man-carrying-tote-bag_53876-96623.jpg', 3500, 1, 4640, 97440, 'user1@aaa.com', 3, 'user1@aaa.com', 3),
  ('2025-02-28 21:02:11.810300', '2025-02-28 21:02:45.928928', '영등포', '경비실에 두고가주세요.', '1111111', 'HWEWON', '07247', '78ktbzfkrqa', '여성 반팔티', 10, 55400, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 68, 'user2@aaa.com', 4),
  ('2025-02-28 21:02:11.813285', '2025-02-28 21:02:45.938620', '영등포', '경비실에 두고가주세요.', '1111111', 'HWEWON', '07247', '78ktbzfkrqa', '방수 블랙 재킷', 8, 555000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 60, 'user2@aaa.com', 4),
  ('2025-02-28 22:10:01.688236', '2025-02-28 22:10:35.758933', '여의도', '문 앞 부탁드려요 ', '12312312', 'Jane Doe', '123123', 'hgdb2sq57le', '방수 블랙 재킷', 8, 555000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 60, 'user2@aaa.com', 5),
  ('2025-02-28 22:14:30.696874', '2025-02-28 22:15:08.936607', '사천', '문 앞 부탁드립니다.', '123123', 'Jungook', '123123', 'f8orvy9vthp', '여성 반팔티', 10, 55400, 1, 'XS', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/9d20964b-a428-4bd7-b59a-86c5eff86a45_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 68, 'user2@aaa.com', 6),
  ('2025-02-28 22:14:30.698179', '2025-02-28 22:15:08.948941', '사천', '문 앞 부탁드립니다.', '123123', 'Jungook', '123123', 'f8orvy9vthp', '방수 블랙 재킷', 8, 555000, 1, 'S', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/f317f660-11e1-491a-bf1e-930fc0fea31f_loly-galina-qQB04yQdosk-unsplash.jpg', 0, 1, 30520, 640920, 'user2@aaa.com', 60, 'user2@aaa.com', 6);

-- tbl_order_payment 생성 및 데이터 삽입
CREATE TABLE tbl_order_payment
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT NULL,
    payment_id BIGINT NULL
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES 
  (1, 1),
  (2, 2),
  (3, 2),
  (4, 3),
  (5, 3),
  (6, 3),
  (7, 3),
  (8, 3),
  (9, 3),
  (10, 3),
  (11, 4),
  (12, 4),
  (13, 5),
  (14, 5),
  (15, 6),
  (16, 6);

---------------------------------------------------------------------------
-- 8. 리뷰 및 기타: tbl_review, tbl_todo
---------------------------------------------------------------------------

-- tbl_review 생성 및 데이터 삽입 (tbl_product, tbl_order, member 참조)
CREATE TABLE tbl_review
(
    rno          BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at   DATETIME(6)  NULL,
    updated_at   DATETIME(6)  NULL,
    content      VARCHAR(255) NULL,
    order_id     VARCHAR(255) NULL,
    rating       INT          NOT NULL,
    oid          BIGINT       NULL,
    member_owner VARCHAR(255) NULL,
    product_id   BIGINT       NULL,
    CONSTRAINT UK_ayvtki6o7v3we6hficu1bx02c UNIQUE (oid),
    CONSTRAINT FKa12qg0difn0jw3m9puletyuxx FOREIGN KEY (product_id) REFERENCES tbl_product (pno),
    CONSTRAINT FKbpttk4apjd74vnskv5gyr056t FOREIGN KEY (member_owner) REFERENCES member (email),
    CONSTRAINT FKnbgpjjqfg4r71hrv4lui41ngd FOREIGN KEY (oid) REFERENCES tbl_order (id)
)
    COLLATE = utf8mb4_general_ci;

INSERT INTO apidb.tbl_review (created_at, updated_at, content, order_id, rating, oid, member_owner, product_id) VALUES 
  ('2025-02-28 11:10:03.123487', '2025-02-28 11:10:03.123487', 'GOOD!', 'eegy5wh642q', 5, 2, 'user1@aaa.com', 1),
  ('2025-02-28 15:58:20.580447', '2025-02-28 15:58:20.580447', 'So so...', 'eegy5wh642q', 3, 3, 'user1@aaa.com', 2);

-- tbl_todo 생성 (독립 테이블)
CREATE TABLE tbl_todo
(
    tno      BIGINT AUTO_INCREMENT PRIMARY KEY,
    complete BIT          NOT NULL,
    content  VARCHAR(255) NULL,
    due_date DATE         NULL,
    title    VARCHAR(500) NOT NULL,
    writer   VARCHAR(255) NULL
)
    COLLATE = utf8mb4_general_ci;
