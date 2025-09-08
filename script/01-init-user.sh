#!/bin/bash
set -e

echo "Running init-user.sh..."

# 환경 변수 확인 로그 (디버깅용, 필요시 주석 처리)
echo "Using DB_NAME=${DB_NAME}"
echo "Using DB_USER=${DB_USER}"
echo "Using DB_PASSWORD=${DB_PASSWORD}"
echo "Using DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD}"

# MariaDB root 계정으로 DB 및 유저 생성
mariadb -u root -p"${DB_ROOT_PASSWORD}" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
    DROP USER IF EXISTS '${DB_USER}'@'%';
    CREATE USER '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL

echo "User and DB initialized."
