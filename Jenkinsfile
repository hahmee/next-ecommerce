pipeline {
    agent any

    environment {
        EC2_HOST = 'ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com'
        SSH_KEY = '/var/lib/jenkins/.ssh/my-jenkins-key'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/hamye4143/next-ecommerce.git'
            }
        }

        stage('Frontend CI') {
            steps {
                dir('client') {
                    sh 'npm ci'
                    sh 'npm run build'
                    // 선택: sh 'npm test'
                }
            }
        }

        stage('Backend CI') {
            steps {
                dir('back') {
                    sh './gradlew clean build -x test' // 여기서 .jar 생성됨
                }
            }
        }

       stage('Send .jar to EC2') {
            steps {
                sh '''
                JAR_FILE=$(find back/build/libs -name "*.jar" | grep -v plain | head -n 1)

                # 1️⃣ 복사 전에 디렉토리 만들기 (중요!)
                ssh -i $SSH_KEY $EC2_HOST "mkdir -p ~/next-ecommerce/back/build/libs"

                # 2️⃣ .jar 파일 복사
                scp -i $SSH_KEY "$JAR_FILE" $EC2_HOST:~/next-ecommerce/back/build/libs/app.jar
                '''
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh """
                ssh -i $SSH_KEY $EC2_HOST << 'EOF'
                cd ~/next-ecommerce
                git pull
                docker system prune -a --volumes --force -f
                docker-compose down
                docker-compose up --build -d
                EOF
                """
            }
        }


    }
}
