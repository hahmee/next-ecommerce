#!/bin/bash
set -e

# MariaDB 시작 후 root로 외부 접속 가능한 유저 추가
mariadb -u root -p"${DB_ROOT_PASSWORD}" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;
    CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON *.* TO '${DB_USER}'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL