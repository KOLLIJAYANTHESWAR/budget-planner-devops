pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                bat "npm install"
            }
        }

        stage('Build') {
            steps {
                bat "npm run build"
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }
}
