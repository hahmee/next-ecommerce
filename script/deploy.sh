#!/bin/bash
# 배포 스크립트: 원격 EC2 서버에서 git pull 및 docker-compose 명령어 실행
ssh -i /var/lib/jenkins/.ssh/my-jenkins-key ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com <<'EOF'
cd ~/next-ecommerce
git pull
docker-compose down
docker-compose up --build -d
EOF
