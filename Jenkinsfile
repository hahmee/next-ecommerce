pipeline {
    agent any

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
                    sh './gradlew clean build'
                    // 선택: sh './gradlew test'
                }
            }
        }

        stage('CD: Deploy') {
            steps {
                sh 'chmod +x ./script/deploy.sh'
                sh './script/deploy.sh'
            }
        }
    }
}
