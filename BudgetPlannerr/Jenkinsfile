pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                bat "mvn clean package"
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
            }
        }
    }
}
