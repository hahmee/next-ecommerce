CREATE DATABASE IF NOT EXISTS apidb;

USE apidb;

-- 사용자 생성 (비밀번호는 환경변수에서 설정한 값을 사용)
CREATE USER IF NOT EXISTS 'apidbuser'@'%' IDENTIFIED BY 'apidbuser';

-- 사용자에게 데이터베이스에 대한 모든 권한 부여
GRANT ALL PRIVILEGES ON apidb.* TO 'apidbuser'@'%';

-- 권한 적용
FLUSH PRIVILEGES;