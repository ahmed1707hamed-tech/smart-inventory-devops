pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh '''
                cd /tmp
                rm -rf smart-inventory-devops || true
                git clone https://github.com/ahmed1707hamed-tech/smart-inventory-devops.git
                cd smart-inventory-devops

                docker-compose down || true
                docker rm -f inventory-db inventory-backend inventory-frontend inventory-gateway || true

                docker-compose up -d --build
                '''
            }
        }
    }
}