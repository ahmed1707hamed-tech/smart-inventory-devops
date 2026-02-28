pipeline {
    agent any

    stages {
        stage('Deploy') {
            steps {
                sh '''
                ssh ec2-user@localhost '
                cd /tmp &&
                rm -rf smart-inventory-devops &&
                git clone https://github.com/ahmed1707hamed-tech/smart-inventory-devops.git &&
                cd smart-inventory-devops &&
                docker-compose down || true &&
                docker-compose up -d --build
                '
                '''
            }
        }
    }
}
