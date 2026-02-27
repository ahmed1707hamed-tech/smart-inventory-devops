pipeline {
    agent any

    stages {

        stage('Build Containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Application') {
            steps {
                sh 'docker compose up -d'
            }
        }
    }
}