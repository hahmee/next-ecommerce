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

create table brand
(
    bno   bigint auto_increment
        primary key,
    brand varchar(255) null
);

create table category
(
    ctno     bigint auto_increment
        primary key,
    category varchar(255) null
);

create table member
(
    email        varchar(255) not null
        primary key,
    encrypted_id varchar(255) null,
    nickname     varchar(255) null,
    password     varchar(255) null,
    social       bit          not null
);

create table member_member_role_list
(
    member_email     varchar(255) not null,
    member_role_list tinyint      null
        check (`member_role_list` between 0 and 2),
    constraint FK2cojwm6nbbasi0xkedqjjagap
        foreign key (member_email) references member (email)
);

create table tbl_cart
(
    cno          bigint auto_increment
        primary key,
    member_owner varchar(255) null,
    constraint UK_4x59g5i516ao54rb4tnf1x85d
        unique (member_owner),
    constraint FK4pvmyvyqisuytcxntao9kimj7
        foreign key (member_owner) references member (email)
);

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
);

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
);

create table tbl_order_payment
(
    id         bigint auto_increment
        primary key,
    order_id   bigint null,
    payment_id bigint null
);

create table tbl_payment
(
    id           bigint auto_increment
        primary key,
    created_at   datetime(6)  null,
    updated_at   datetime(6)  null,
    country      varchar(255) null,
    method       tinyint      null
        check (`method` between 0 and 1),
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
);

create table tbl_product
(
    pno            bigint auto_increment
        primary key,
    created_at     datetime(6)  null,
    updated_at     datetime(6)  null,
    brand          varchar(255) null,
    change_policy  varchar(255) null,
    del_flag       bit          not null,
    pdesc          varchar(255) null,
    pname          varchar(255) null,
    price          int          not null,
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
);

create table product_image_list
(
    product_pno bigint       not null,
    file_key    varchar(255) null,
    file_name   varchar(255) null,
    ord         int          not null,
    constraint FKfqvvs4dg13jiki1fur4s3qa43
        foreign key (product_pno) references tbl_product (pno)
);

create table product_size_list
(
    product_pno bigint       not null,
    size_list   varchar(255) null,
    constraint FKebo33vum2b33xe71t95kncyoy
        foreign key (product_pno) references tbl_product (pno)
);

create table tbl_color_tag
(
    id         bigint auto_increment
        primary key,
    color      varchar(255) null,
    text       varchar(255) null,
    product_id bigint       null,
    constraint FKcqi4pxvfqeyah7bsuewbnw6m5
        foreign key (product_id) references tbl_product (pno)
);

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
);

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
    price         int          not null,
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
);

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
);

create table tbl_todo
(
    tno      bigint auto_increment
        primary key,
    complete bit          not null,
    due_date date         null,
    title    varchar(255) null,
    writer   varchar(255) null
);



-- 예시 데이터 삽입
--USER
INSERT INTO apidb.member (email, nickname, password, social, encrypted_id) VALUES ('user1@aaa.com', 'USER1', '$2a$10$jnhB3L2L0my4QQoq6ANkKua4mtKGG1XHNBeGlJHuoGMsxcxh2Mb4S', false, null);


-- USER ROLE
INSERT INTO apidb.member_member_role_list (member_email, member_role_list) VALUES ('user1@aaa.com', 2);


