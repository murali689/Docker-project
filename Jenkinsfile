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
                    echo "Checking Docker..."
                    docker --version

                    echo "Checking Docker Compose..."
                    docker-compose --version
                '''
            }
        }

        stage('Create Environment File') {
            steps {
                sh '''
                    if [ ! -f .env ]; then
                        cp .env.example .env
                    fi

                    echo ".env file created successfully"
                    ls -la .env
                '''
            }
        }

        stage('Verify Project Files') {
            steps {
                sh '''
                    echo "Project files:"
                    ls -la

                    echo "Checking docker-compose.yml..."
                    test -f docker-compose.yml

                    echo "Checking application directory..."
                    test -d app

                    echo "Checking nginx directory..."
                    test -d nginx
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Building Docker images..."
                    docker-compose build --no-cache
                '''
            }
        }

        stage('Stop Existing Application') {
            steps {
                sh '''
                    echo "Stopping existing application..."
                    docker-compose down || true
                '''
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    echo "Starting application..."
                    docker-compose up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "Waiting for containers..."
                    sleep 15

                    echo "Container status:"
                    docker-compose ps

                    echo "Docker containers:"
                    docker ps

                    echo "Testing application health..."
                    curl -f http://localhost/health
                '''
            }
        }
    }

    post {

        success {
            echo '''
            ==========================================
            APPLICATION DEPLOYED SUCCESSFULLY!
            ==========================================
            '''
        }

        failure {
            echo '''
            ==========================================
            DEPLOYMENT FAILED!
            Check the Console Output.
            ==========================================
            '''
        }

        always {
            echo "Final container status:"
            sh '''
                docker-compose ps || true
            '''
        }
    }
}
