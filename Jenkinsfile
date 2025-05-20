pipeline {
    agent any

    environment {
        EC2_HOST = 'ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com'
        SSH_KEY = '/var/lib/jenkins/.ssh/my-j   enkins-key'
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
                sh 'scp -i $SSH_KEY back/build/libs/*.jar $EC2_HOST:~/next-ecommerce/back/build/libs/app.jar'
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh """
                ssh -i $SSH_KEY $EC2_HOST << 'EOF'
                cd ~/next-ecommerce
                git pull
                docker-compose down
                docker-compose up --build -d
                EOF
                """
            }
        }

//         stage('CD: Deploy') {
//             steps {
//                 sh 'chmod +x ./script/deploy.sh'
//                 sh './script/deploy.sh'
//             }
//         }
    }
}
