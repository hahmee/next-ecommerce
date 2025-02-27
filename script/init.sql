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

create table member_member_role_list
(
    member_email     varchar(255) not null,
    member_role_list tinyint      null
        check (`member_role_list` between 0 and 2),
    constraint FK2cojwm6nbbasi0xkedqjjagap
        foreign key (member_email) references member (email)
)
    collate = utf8mb4_general_ci;

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

create table tbl_category_closure
(
    depth          int    not null,
    descendant_cno bigint not null,
    ancestor_cno   bigint not null,
    primary key (ancestor_cno, descendant_cno),
    constraint FK4ocjdplm8qkynki9xbv8u9ewa
        foreign key (ancestor_cno) references tbl_category (cno),
    constraint FKtqmnhrab7f7o30ivo487p3ppv
        foreign key (descendant_cno) references tbl_category (cno)
)
    collate = utf8mb4_general_ci;

create table tbl_order_payment
(
    id         bigint auto_increment
        primary key,
    order_id   bigint null,
    payment_id bigint null
)
    collate = utf8mb4_general_ci;

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

create table product_size_list
(
    product_pno bigint       not null,
    size_list   varchar(255) null,
    constraint FKebo33vum2b33xe71t95kncyoy
        foreign key (product_pno) references tbl_product (pno)
)
    collate = utf8mb4_general_ci;

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



-- 예시 데이터 삽입
--USER
-- INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user1@aaa.com', 'USER1', '$2a$10$jnhB3L2L0my4QQoq6ANkKua4mtKGG1XHNBeGlJHuoGMsxcxh2Mb4S', false, null);
--
--
-- -- USER ROLE
-- INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user1@aaa.com', 2);
--



-- 1. member (10개)
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES
('user1@aaa.com', 'USER1', '$2a$10$jnhB3L2L0my4QQoq6ANkKua4mtKGG1XHNBeGlJHuoGMsxcxh2Mb4S', false, NULL),
('user2@aaa.com', 'USER2', '$2a$10$Im2GAgKbMUKHXoOXK3dZAeTeUpdkTEG78cM6drco/36GKoHmPc1IG', false, NULL),
('user3@aaa.com', 'USER3', '$2a$10$JmLOnSrs0Z5QacwkMsai5eDMQV55kBjmhyAYo/wXEKffD9MGuwj06', false, NULL),
('user4@aaa.com', 'USER4', '$2a$10$uNOBz/6vYpvrgoNxbJdMdOprD9A1jDTQlza3rn2nfLeEoA/7jf2sO', false, NULL),
('user5@aaa.com', 'USER5', '$2a$10$XXiBmLu2kiGuYfTZh.wSi.VmOBssgYuKrZw/Q2VObTVl1YbLsDf0.', false, NULL),
('user6@aaa.com', 'USER6', '$2a$10$cWumMVXmXrNzR4RVkSptmuc6pRLQuE7h0bZYOOgvgrQ6tgM23fd6S', false, NULL),
('user7@aaa.com', 'USER7', '$2a$10$lb6Lw7uhJZQuGk7tyONpHOrnMGDfEHZOVhtCI3W4iyIPzGYUvtoCC', false, NULL),
('user8@aaa.com', 'USER8', '$2a$10$JzV7MwHQL1oi0H.91c8FSuRI8yDgB92s/8jnFHoMad8vOTmv/cMWO', false, NULL),
('user9@aaa.com', 'USER9', '$2a$10$mvxa85LaAKv6n72WHmaq5.eagqUZbr6TxK/FNR4/TbtoXQyykJI5q', false, NULL),
('user10@aaa.com', 'USER10', 'password10', false, NULL);

--------------------------------------------------
-- 2. member_member_role_list (10개)
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES
('user1@aaa.com', 2),
('user2@aaa.com', 1),
('user3@aaa.com', 0),
('user4@aaa.com', 2),
('user5@aaa.com', 1),
('user6@aaa.com', 0),
('user7@aaa.com', 2),
('user8@aaa.com', 1),
('user9@aaa.com', 0),
('user10@aaa.com', 2);

--------------------------------------------------
-- 3. tbl_cart (10개)
INSERT INTO apidb.tbl_cart (member_owner) VALUES
('user1@aaa.com'),
('user2@aaa.com'),
('user3@aaa.com'),
('user4@aaa.com'),
('user5@aaa.com'),
('user6@aaa.com'),
('user7@aaa.com'),
('user8@aaa.com'),
('user9@aaa.com'),
('user10@aaa.com');

--------------------------------------------------
-- 4. tbl_category (10개)

INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-27 23:26:02.988972', '2025-02-27 23:47:36.236467', 'category1', 'category1', false, 'category/bea0a557-8dfe-4035-a08e-eba3c7ceea28_3b144b3d12dbae362a2597e10d536c75.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/bea0a557-8dfe-4035-a08e-eba3c7ceea28_3b144b3d12dbae362a2597e10d536c75.jpg');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-27 23:26:27.151694', '2025-02-27 23:26:27.151694', 'subCategory1', 'subCategory1', false, 'category/608818f9-33d2-4413-86b1-4903099ddaef_íë©´ ìº¡ì² 2025-02-02 185420.png', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/608818f9-33d2-4413-86b1-4903099ddaef_íë©´ ìº¡ì² 2025-02-02 185420.png');
INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES ('2025-02-27 23:27:05.954157', '2025-02-27 23:47:32.470709', 'category2', 'category2', false, 'category/206cc559-1ab8-49c0-a34f-0cb26f091fa1_landscape-desktop-wallpaper.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/206cc559-1ab8-49c0-a34f-0cb26f091fa1_landscape-desktop-wallpaper.jpg');


-- INSERT INTO apidb.tbl_category (created_at, updated_at, cdesc, cname, del_flag, file_key, file_name) VALUES
-- (NOW(), NOW(), 'Category Description 1', 'Category 1', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 2', 'Category 2', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 3', 'Category 3', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 4', 'Category 4', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 5', 'Category 5', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 6', 'Category 6', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 7', 'Category 7', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 8', 'Category 8', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 9', 'Category 9', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
-- (NOW(), NOW(), 'Category Description 10', 'Category 10', 0, 'category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/category/ee30b863-42f7-4ea0-9439-7c9af1cb0f92_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg'),
--
--

--------------------------------------------------
-- 5. tbl_category_closure (10개, 자기 자신에 대한 self-reference)
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 1, 1);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (1, 2, 1);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 2, 2);
INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES (0, 3, 3);


-- INSERT INTO apidb.tbl_category_closure (depth, descendant_cno, ancestor_cno) VALUES
-- (0, 1, 1),
-- (0, 2, 2),
-- (0, 3, 3),
-- (0, 4, 4),
-- (0, 5, 5),
-- (0, 6, 6),
-- (0, 7, 7),
-- (0, 8, 8),
-- (0, 9, 9),
-- (0, 10, 10);

--------------------------------------------------
-- 6. tbl_order_payment (10개)
INSERT INTO apidb.tbl_order_payment (order_id, payment_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

--------------------------------------------------
-- 7. tbl_payment (10개)
INSERT INTO apidb.tbl_payment (created_at, updated_at, country, method, order_id, order_name, payment_key, status, total_amount, type, member_owner) VALUES
(NOW(), NOW(), 'KR', 0, 'ORD1', 'Order Name 1', 'PAY1', 0, 1000, 0, 'user1@aaa.com'),
(NOW(), NOW(), 'KR', 1, 'ORD2', 'Order Name 2', 'PAY2', 1, 2000, 1, 'user2@aaa.com'),
(NOW(), NOW(), 'KR', 0, 'ORD3', 'Order Name 3', 'PAY3', 2, 3000, 2, 'user3@aaa.com'),
(NOW(), NOW(), 'KR', 1, 'ORD4', 'Order Name 4', 'PAY4', 3, 4000, 0, 'user4@aaa.com'),
(NOW(), NOW(), 'KR', 0, 'ORD5', 'Order Name 5', 'PAY5', 4, 5000, 1, 'user5@aaa.com'),
(NOW(), NOW(), 'KR', 1, 'ORD6', 'Order Name 6', 'PAY6', 5, 6000, 2, 'user6@aaa.com'),
(NOW(), NOW(), 'KR', 0, 'ORD7', 'Order Name 7', 'PAY7', 6, 7000, 0, 'user7@aaa.com'),
(NOW(), NOW(), 'KR', 1, 'ORD8', 'Order Name 8', 'PAY8', 7, 8000, 1, 'user8@aaa.com'),
(NOW(), NOW(), 'KR', 0, 'ORD9', 'Order Name 9', 'PAY9', 0, 9000, 2, 'user9@aaa.com'),
(NOW(), NOW(), 'KR', 1, 'ORD10', 'Order Name 10', 'PAY10', 1, 10000, 0, 'user10@aaa.com');

--------------------------------------------------
-- 8. tbl_product (10개)
INSERT INTO apidb.tbl_product (created_at, updated_at, change_policy, del_flag, pdesc, pname, price, refund_policy, sales_status, sku, admin_category, member_owner) VALUES
(NOW(), NOW(), 'Policy A', 0, 'Product Description 1', 'Product 1', 1000, 'Refund A', 0, 'SKU1', 1, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy B', 0, 'Product Description 2', 'Product 2', 2000, 'Refund B', 1, 'SKU2', 2, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy C', 0, 'Product Description 3', 'Product 3', 3000, 'Refund C', 2, 'SKU3', 3, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy D', 0, 'Product Description 4', 'Product 4', 4000, 'Refund D', 0, 'SKU4', 1, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy E', 0, 'Product Description 5', 'Product 5', 5000, 'Refund E', 1, 'SKU5', 2, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy F', 0, 'Product Description 6', 'Product 6', 6000, 'Refund F', 2, 'SKU6', 3, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy G', 0, 'Product Description 7', 'Product 7', 7000, 'Refund G', 0, 'SKU7', 1, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy H', 0, 'Product Description 8', 'Product 8', 8000, 'Refund H', 1, 'SKU8', 2, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy I', 0, 'Product Description 9', 'Product 9', 9000, 'Refund I', 2, 'SKU9', 3, 'user1@aaa.com'),
(NOW(), NOW(), 'Policy J', 0, 'Product Description 10', 'Product 10', 10000, 'Refund J', 0, 'SKU10', 1, 'user1@aaa.com');


--------------------------------------------------
-- 10. product_image_list (10개)
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (1, 'product/66c8028e-859d-43cb-8ea3-7dae4f218a44_kizkopop-aYGvHIwhm5c-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/66c8028e-859d-43cb-8ea3-7dae4f218a44_kizkopop-aYGvHIwhm5c-unsplash.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (2, 'product/65f265e6-b051-4f0f-9750-5d8ffb2128e9_ali-choubin-Cjekb8Mq3Lg-unsplash.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/65f265e6-b051-4f0f-9750-5d8ffb2128e9_ali-choubin-Cjekb8Mq3Lg-unsplash.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (3, 'product/d2b25ad9-7f99-403e-b96d-4b8d31a1e932_c514a46322bdc8d4f1e0c6f96f510597.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/d2b25ad9-7f99-403e-b96d-4b8d31a1e932_c514a46322bdc8d4f1e0c6f96f510597.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (4, 'product/7da835b6-ba72-4bf5-ae8f-014fc05251dc_db0abe1c1d046a46913d8a60a9fd3457.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/7da835b6-ba72-4bf5-ae8f-014fc05251dc_db0abe1c1d046a46913d8a60a9fd3457.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (5, 'product/150b4225-9f89-4a5d-8c3d-5f8685ff3870_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/150b4225-9f89-4a5d-8c3d-5f8685ff3870_3ca83260-3b83-428c-a372-7898e714b07a_5711c80a8e070bfed1712e9bb6f02500.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (6, 'product/803fa809-228a-4b18-85cb-25c969947dc2_korea.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/803fa809-228a-4b18-85cb-25c969947dc2_korea.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (7, 'product/134d409d-c2c9-418d-a745-1e7480fc738d_kfc.png', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/134d409d-c2c9-418d-a745-1e7480fc738d_kfc.png', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (8, 'product/a4e2024c-9d10-49e0-92c6-22c2c9ad3b12_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/a4e2024c-9d10-49e0-92c6-22c2c9ad3b12_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (1).jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (9, 'product/ceb4016b-6087-44f1-a805-8ed70e301742_d275ad3059fd0958e0087916a0aaff45.jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/ceb4016b-6087-44f1-a805-8ed70e301742_d275ad3059fd0958e0087916a0aaff45.jpg', 0);
INSERT INTO apidb.product_image_list (product_pno, file_key, file_name, ord) VALUES (10, 'product/464b67ed-2ac2-4fc6-a271-c05bf3a5d41e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (2).jpg', 'https://e-commerce-nextjs.s3.ap-northeast-2.amazonaws.com/product/464b67ed-2ac2-4fc6-a271-c05bf3a5d41e_3ca0b8b0-c89a-4ef9-9225-5224d8b51c87_476b12cf1a3623bc4cd2060495bef990 (2).jpg', 0);

--------------------------------------------------
-- 11. product_size_list (10개)
INSERT INTO apidb.product_size_list (product_pno, size_list) VALUES
(1, 'S,M,L'),
(2, 'M,L,XL'),
(3, 'S,L'),
(4, 'M,XL'),
(5, 'S,M'),
(6, 'L,XL,XXL'),
(7, 'XS,S,M'),
(8, 'M,L'),
(9, 'S,M,L,XL'),
(10, 'M,L,XL,XXL');

--------------------------------------------------
-- 12. tbl_color_tag (10개)
INSERT INTO apidb.tbl_color_tag (color, text, product_id) VALUES
('#ff0000', 'Red', 1),
('#ff0000', 'Blue', 2),
('#ff0000', 'Green', 3),
('#ff0000', 'Yellow', 4),
('#ff0000', 'Black', 5),
('#ff0000', 'White', 6),
('#ff0000', 'Purple', 7),
('#ff0000', 'Orange', 8),
('#ff0000', 'Pink', 9),
('#ff0000', 'Gray', 10);

--------------------------------------------------
-- 13. tbl_cart_item (10개)
INSERT INTO apidb.tbl_cart_item (qty, size, cart_cno, color_id, product_pno, member_seller) VALUES
(1, 'M', 1, 1, 1, 'user2@aaa.com'),
(2, 'L', 2, 2, 2, 'user3@aaa.com'),
(1, 'S', 3, 3, 3, 'user4@aaa.com'),
(3, 'XL', 4, 4, 4, 'user5@aaa.com'),
(2, 'M', 5, 5, 5, 'user6@aaa.com'),
(1, 'L', 6, 6, 6, 'user7@aaa.com'),
(2, 'S', 7, 7, 7, 'user8@aaa.com'),
(3, 'XL', 8, 8, 8, 'user9@aaa.com'),
(1, 'M', 9, 9, 9, 'user10@aaa.com'),
(2, 'L', 10, 10, 10, 'user1@aaa.com');

--------------------------------------------------
-- 14. tbl_order (10개)
INSERT INTO apidb.tbl_order (created_at, updated_at, address, message, phone, receiver, zip_code, order_id, pname, pno, price, qty, size, thumbnail_url, shipping_fee, status, tax, total_amount, member_owner, color_id, member_seller, payment_id) VALUES
(NOW(), NOW(), 'Address 1', 'Message 1', '010-1111-1111', 'Receiver 1', '12345', 'ORD1', 'Product 1', 1, 1000, 1, 'M', 'thumb1.jpg', 10, 1, 100, 1110, 'user1@aaa.com', 1, 'user2@aaa.com', 1),
(NOW(), NOW(), 'Address 2', 'Message 2', '010-2222-2222', 'Receiver 2', '23456', 'ORD2', 'Product 2', 2, 2000, 2, 'L', 'thumb2.jpg', 20, 2, 200, 4440, 'user2@aaa.com', 2, 'user3@aaa.com', 2),
(NOW(), NOW(), 'Address 3', 'Message 3', '010-3333-3333', 'Receiver 3', '34567', 'ORD3', 'Product 3', 3, 3000, 3, 'S', 'thumb3.jpg', 30, 3, 300, 9300, 'user3@aaa.com', 3, 'user4@aaa.com', 3),
(NOW(), NOW(), 'Address 4', 'Message 4', '010-4444-4444', 'Receiver 4', '45678', 'ORD4', 'Product 4', 4, 4000, 4, 'XL', 'thumb4.jpg', 40, 4, 400, 17600, 'user4@aaa.com', 4, 'user5@aaa.com', 4),
(NOW(), NOW(), 'Address 5', 'Message 5', '010-5555-5555', 'Receiver 5', '56789', 'ORD5', 'Product 5', 5, 5000, 5, 'M', 'thumb5.jpg', 50, 5, 500, 27500, 'user5@aaa.com', 5, 'user6@aaa.com', 5),
(NOW(), NOW(), 'Address 6', 'Message 6', '010-6666-6666', 'Receiver 6', '67890', 'ORD6', 'Product 6', 6, 6000, 6, 'L', 'thumb6.jpg', 60, 6, 600, 39600, 'user6@aaa.com', 6, 'user7@aaa.com', 6),
(NOW(), NOW(), 'Address 7', 'Message 7', '010-7777-7777', 'Receiver 7', '78901', 'ORD7', 'Product 7', 7, 7000, 7, 'S', 'thumb7.jpg', 70, 7, 700, 53900, 'user7@aaa.com', 7, 'user8@aaa.com', 7),
(NOW(), NOW(), 'Address 8', 'Message 8', '010-8888-8888', 'Receiver 8', '89012', 'ORD8', 'Product 8', 8, 8000, 8, 'XL', 'thumb8.jpg', 80, 8, 800, 70400, 'user8@aaa.com', 8, 'user9@aaa.com', 8),
(NOW(), NOW(), 'Address 9', 'Message 9', '010-9999-9999', 'Receiver 9', '90123', 'ORD9', 'Product 9', 9, 9000, 9, 'M', 'thumb9.jpg', 90, 9, 900, 89100, 'user9@aaa.com', 9, 'user10@aaa.com', 9),
(NOW(), NOW(), 'Address 10', 'Message 10', '010-1010-1010', 'Receiver 10', '01234', 'ORD10', 'Product 10', 10, 10000, 10, 'L', 'thumb10.jpg', 100, 10, 100, 111000, 'user10@aaa.com', 10, 'user1@aaa.com', 10);

--------------------------------------------------
-- 15. tbl_review (10개)
INSERT INTO apidb.tbl_review (created_at, updated_at, content, order_id, rating, oid, member_owner, product_id) VALUES
(NOW(), NOW(), 'Review content 1', 'ORD1', 5, 1, 'user1@aaa.com', 1),
(NOW(), NOW(), 'Review content 2', 'ORD2', 4, 2, 'user2@aaa.com', 2),
(NOW(), NOW(), 'Review content 3', 'ORD3', 3, 3, 'user3@aaa.com', 3),
(NOW(), NOW(), 'Review content 4', 'ORD4', 5, 4, 'user4@aaa.com', 4),
(NOW(), NOW(), 'Review content 5', 'ORD5', 2, 5, 'user5@aaa.com', 5),
(NOW(), NOW(), 'Review content 6', 'ORD6', 4, 6, 'user6@aaa.com', 6),
(NOW(), NOW(), 'Review content 7', 'ORD7', 5, 7, 'user7@aaa.com', 7),
(NOW(), NOW(), 'Review content 8', 'ORD8', 3, 8, 'user8@aaa.com', 8),
(NOW(), NOW(), 'Review content 9', 'ORD9', 4, 9, 'user9@aaa.com', 9),
(NOW(), NOW(), 'Review content 10', 'ORD10', 5, 10, 'user10@aaa.com', 10);

