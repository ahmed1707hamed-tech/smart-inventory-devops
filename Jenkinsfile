pipeline {
    agent any

    stages {

        stage('Build Containers') {
            steps {
                sh '''
                pwd
                ls -la
                docker-compose -f docker-compose.yml build
                '''
            }
        }

        stage('Run Application') {
            steps {
                sh '''
                docker-compose -f docker-compose.yml up -d
                '''
            }
        }
    }
}