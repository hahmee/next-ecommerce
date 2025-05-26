pipeline {
  agent any

  environment {
    FRONT_IMAGE = "hamye4143/next-ecommerce-frontend"
    BACK_IMAGE  = "hamye4143/next-ecommerce-backend"
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/hamye4143/next-ecommerce.git'
      }
    }

    stage('Build Frontend') {
      steps {
        dir('client') {
          sh 'npm ci'
          sh 'npm run build'
          sh 'docker build -t $FRONT_IMAGE -f Dockerfile .'
        }
      }
    }

    stage('Build Backend') {
      steps {
        dir('back') {
          sh './gradlew clean build -x test'
          sh 'docker build -t $BACK_IMAGE -f Dockerfile .'
        }
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $FRONT_IMAGE
            docker push $BACK_IMAGE
          '''
        }
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent(credentials: ['ec2-ssh-key']) {
          sh '''
              ssh -o StrictHostKeyChecking=no ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com << EOF

              echo "[🔧 Clean up Docker]"
              docker system prune -a --force

              echo "[📦 Pull latest images]"
              docker pull $FRONT_IMAGE
              docker pull $BACK_IMAGE

              echo "[🔁 Restart frontend container]"
              docker stop frontend || true
              docker rm frontend || true
              docker run -d --name frontend -p 80:3000 $FRONT_IMAGE

              echo "[🔁 Restart backend container]"
              docker stop backend || true
              docker rm backend || true
              docker run -d --name backend -p 8080:8080 $BACK_IMAGE
            EOF
          '''
        }
      }
    }
  }
}
