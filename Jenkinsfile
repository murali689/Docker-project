pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'docker-project'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning GitHub repository...'
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                sh '''
                    docker --version
                    docker compose version
                '''
            }
        }

        stage('Create Environment File') {
            steps {
                sh '''
                    if [ ! -f .env ]; then
                        cp .env.example .env
                    fi
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker compose build --no-cache
                '''
            }
        }

        stage('Stop Existing Application') {
            steps {
                sh '''
                    docker compose down || true
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    docker compose up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 15
                    docker compose ps
                    curl -f http://localhost/health
                '''
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo 'Application deployed successfully!'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'Deployment failed!'
            echo 'Check Jenkins Console Output.'
            echo '======================================'
        }

        always {
            sh '''
                docker compose ps || true
            '''
        }
    }
}
