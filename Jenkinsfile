#!/usr/bin/env groovy

pipeline {
  agent any

  environment {
    USER_UID = sh(script: 'id -u', returnStdout: true).trim()
    GROUP_GID = sh(script: 'id -g', returnStdout: true).trim()
  }

  stages {
    stage('Install dependencies') {
      steps {
        script {
          sh('docker compose -f docker-compose.yml run -e NPM_TOKEN=$NPM_TOKEN -e TIPTAP_PRO_TOKEN=$TIPTAP_PRO_TOKEN --rm -u $USER_UID:$GROUP_GID node sh -c "pnpm install"')
        }
      }
    }

    stage('Build packages') {
      steps {
        sh('docker compose -f docker-compose.yml run --rm -u $USER_UID:$GROUP_GID node sh -c "pnpm build"')
      }
    }

    stage('Publish packages') {
      steps {
        configFileProvider([configFile(fileId: '.npmrc-infra-front', variable: 'NPMRC')]) {
          sh "cp $NPMRC .npmrc"
          withCredentials([usernameColonPassword(credentialsId: 'jenkins-public-fine-grained-pat', variable: 'GITHUB_API_TOKEN')]) {
            script {
              def publishCommand = "node packages/cli/bin/index.js publish --branch ${params.GIT_BRANCH}"
              if (params.CI) {
                sh "docker compose -f docker-compose.yml run -e GH_TOKEN=\$GITHUB_API_TOKEN --rm -u \$USER_UID:\$GROUP_GID node sh -c 'CI=true ${publishCommand}'"
              } else {
                sh "docker compose -f docker-compose.yml run -e GH_TOKEN=\$GITHUB_API_TOKEN --rm -u \$USER_UID:\$GROUP_GID node sh -c '${publishCommand}'"
              }
            }
          }
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
