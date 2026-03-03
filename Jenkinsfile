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
                docker build -t $DASH_IMAGE ./services/dashboard
                '''
            }
        }

        stage('Push Dashboard Image') {
            steps {
                sh '''
                docker push $DASH_IMAGE
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f dashboard.yaml
                kubectl rollout restart deployment inventory-dashboard
                '''
            }
        }
    }
}