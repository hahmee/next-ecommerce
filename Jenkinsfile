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
        }
      }
    }

    stage('Backend CI') {
      steps {
        dir('back') {
          sh './gradlew clean build -x test'
        }
      }
    }

    stage('Send Backend to EC2') {
      steps {
        script {
          def jarPath = sh(
            script: "find back/build/libs -name '*.jar' | grep -v plain | head -n 1",
            returnStdout: true
          ).trim()

          sh """
            ssh -i /var/lib/jenkins/.ssh/my-jenkins-key ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com mkdir -p /home/ubuntu/next-ecommerce/back
            scp -i /var/lib/jenkins/.ssh/my-jenkins-key ${jarPath} ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com:/home/ubuntu/next-ecommerce/back/app.jar
          """
        }
      }
    }

    stage('Deploy Backend on EC2') {
      steps {
        sh """
        ssh -i /var/lib/jenkins/.ssh/my-jenkins-key ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com << 'EOF'
          cd /home/ubuntu/next-ecommerce/back
          cat > Dockerfile << 'DOCKER'
FROM amazoncorretto:17
WORKDIR /usr/src/app
COPY app.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
DOCKER

          docker stop backend-container || true
          docker rm backend-container || true
          docker build -t next-ecommerce-back .
          docker run -d --name backend-container -p 8080:8080 next-ecommerce-back
        EOF
        """
      }
    }

    stage('Send Frontend to EC2') {
      steps {
        sh """
          ssh -i /var/lib/jenkins/.ssh/my-jenkins-key ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com mkdir -p /home/ubuntu/next-ecommerce/client

          scp -i /var/lib/jenkins/.ssh/my-jenkins-key -r \
            client/.next \
            client/node_modules \
            client/public \
            client/package.json \
            client/Dockerfile \
            ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com:/home/ubuntu/next-ecommerce/client/
        """
      }
    }

    stage('Deploy Frontend on EC2') {
      steps {
        sh """
        ssh -i /var/lib/jenkins/.ssh/my-jenkins-key ubuntu@ec2-43-200-23-21.ap-northeast-2.compute.amazonaws.com << 'EOF'
          cd /home/ubuntu/next-ecommerce/client
          docker stop frontend-container || true
          docker rm frontend-container || true
          docker build -t next-ecommerce-front .
          docker run -d --name frontend-container -p 3000:3000 next-ecommerce-front
        EOF
        """
      }
    }
  }
}
