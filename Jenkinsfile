pipeline {
    agent any

    environment {
        DASH_IMAGE = "ahmed7amed9/inventory-dashboard:latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Dashboard Image') {
            steps {
                sh '''
                docker build --no-cache -t $DASH_IMAGE ./services/dashboard
                '''
            }
        }

        stage('Login DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: '0e6ef20b-4651-4b6e-9cb5-9e2180635e00',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Dashboard Image') {
            steps {
                sh 'docker push $DASH_IMAGE'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl rollout restart deployment inventory-dashboard'
            }
        }
    }
}