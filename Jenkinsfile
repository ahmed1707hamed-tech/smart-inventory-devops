pipeline {
    agent any

    stages {

        stage('Build Containers') {
            steps {
                sh '''
                cd services
                docker-compose build
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh '''
                cd services
                docker-compose up -d
                '''
            }
        }
    }
}