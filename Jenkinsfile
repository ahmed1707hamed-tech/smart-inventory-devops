pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f backend.yaml
                kubectl apply -f frontend.yaml
                kubectl apply -f gateway.yaml
                kubectl apply -f dashboard.yaml
                kubectl apply -f database.yaml
                '''
            }
        }
    }
}