pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/ahmed1707hamed-tech/smart-inventory-devops.git'
            }
        }

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