#!/usr/bin/env groovy

pipeline {
  agent any

  parameters {
    string(name: 'NPM_TAG', defaultValue: '', description: 'Override du tag npm (vide = latest sur main, nom de la branche sinon)')
  }

  environment {
    NEXUS_USERNAME = 'admin'
    NEXUS_PASSWORD = credentials('nexus-ode-password')
  }

  stages {
    stage('Init') {
      steps {
        sh './scripts/publish.sh clean init'
      }
    }
    
    stage('Build') {
      steps {
        sh './scripts/publish.sh build'
      }
    }

    stage('Publish') {
      steps {
        configFileProvider([configFile(fileId: '.npmrc-infra-front-nexus', variable: 'NPMRC')]) {
          sh 'cp $NPMRC .npmrc'
          // Nexus uses basic auth: NPM_TOKEN carries base64(user:password) for _auth
          sh 'export NPM_TOKEN=$(printf "%s:%s" "$NEXUS_USERNAME" "$NEXUS_PASSWORD" | base64 | tr -d "\\n") && ./scripts/publish.sh publish'
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}

