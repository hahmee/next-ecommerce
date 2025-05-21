pipeline {
  agent any

  environment {
    DOCKERHUB_REPO = "" //
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/hamye4143/next-ecommerce.git'
      }
    }

    stage('Install Frontend Dependencies & Build') {
      steps {
        dir('client') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Build Backend') {
      steps {
        dir('back') {
          sh './gradlew clean build -x test'
        }
      }
    }

    stage('Build & Push Docker Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh """
            docker build -t $DOCKERHUB_REPO/next-ecommerce -f unified.Dockerfile .

            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $DOCKERHUB_REPO/next-ecommerce
          """
        }
      }
    }
  }
}
