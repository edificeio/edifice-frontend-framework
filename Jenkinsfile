#!/usr/bin/env groovy

pipeline {
  agent any

  environment {
    NPM_TOKEN = credentials('npm-token')
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
        configFileProvider([configFile(fileId: '.npmrc-infra-front', variable: 'NPMRC')]) {
          sh 'cp $NPMRC .npmrc'
          sh './scripts/publish.sh publish'
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

