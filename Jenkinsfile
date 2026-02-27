pipeline {
    agent any

    stages {

        stage('Build & Run') {
            steps {
                sh '''
                cd /home/ec2-user
                rm -rf smart-inventory || true
                git clone https://github.com/ahmed1707hamed-tech/smart-inventory-devops.git
                cd smart-inventory-devops
                docker compose up -d --build
                '''
            }
        }
    }
}