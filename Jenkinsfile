pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerHub') // Jenkins credentials ID for Docker Hub
        // KUBE_CONFIG = credentials('kube-config') // Jenkins credentials ID for Kubernetes config
        GITHUB_TOKEN = credentials('github-token') // Jenkins credentials ID for GitHub token
        GCP_CREDENTIALS = credentials('gcp-service-account')
        KUBECTL = 'kubectl'
        PROJECT_ID = 'elgoog-drive-404315'
        CLUSTER_NAME = 'drive-cluster'
        CLUSTER_ZONE = 'us-central1-c'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Using GitHub token to authenticate
                    git url: 'https://github.com/Himan-Miku/elgoog-drive.git',
                        branch: 'main',
                        credentialsId: 'github-token'
                }
            }
        }
        
        stage('Clean Up Docker Images') {
            steps {
                script {
                    sh "docker images -q --filter 'dangling=true' | xargs --no-run-if-empty docker rmi"

                    // Remove previously built images with specific names
                    def imagesToRemove = ['himanmiku/elgoog-drive-backend:latest', 'himanmiku/elgoog-drive-frontend:latest']
                    for (image in imagesToRemove) {
                        sh "docker images --format '{{.Repository}}:{{.Tag}}' | grep '${image}' | xargs --no-run-if-empty docker rmi"
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t himanmiku/elgoog-drive-backend:latest .'
                    }
                    dir('frontend') {
                        sh 'docker build -t himanmiku/elgoog-drive-frontend:latest .'
                    }
                }
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push himanmiku/elgoog-drive-backend:latest'
                    sh 'docker push himanmiku/elgoog-drive-frontend:latest'
                }
            }
        }

        stage('Scan Docker Images with Trivy') {
            steps {
                script {
                    sh 'trivy image --format json --output trivy-backend-report.json himanmiku/elgoog-drive-backend:latest'
                    sh 'trivy image --format json --output trivy-frontend-report.json himanmiku/elgoog-drive-frontend:latest'
                }
            }
        }

        stage('Configure gcloud') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'gcp-service-account', variable: 'GCLOUD_SERVICE_KEY')]) {
                        sh 'gcloud auth activate-service-account --key-file=$GCLOUD_SERVICE_KEY'
                        sh "gcloud config set project ${env.PROJECT_ID}"
                        sh "gcloud container clusters get-credentials ${env.CLUSTER_NAME} --zone ${env.CLUSTER_ZONE} --project ${env.PROJECT_ID}"
                    }
                }
            }
        }

        stage('Deploy Application to GKE') {
            steps {
                script {
                    sh "${env.KUBECTL} apply -f kubernetes/namespace.yaml"
                    sh "${env.KUBECTL} apply -f kubernetes/secrets/backend-secrets.yaml"
                    sh "${env.KUBECTL} apply -f kubernetes/secrets/frontend-secrets.yaml"
                    sh "${env.KUBECTL} apply -f kubernetes/deployments/backend-deployment.yml"
                    sh "${env.KUBECTL} apply -f kubernetes/deployments/frontend-deployment.yml"
                    sh "${env.KUBECTL} apply -f kubernetes/services/backend-service.yml"
                    sh "${env.KUBECTL} apply -f kubernetes/services/frontend-service.yml"
                }
            }
        }
        
        stage('Setup Prometheus & Grafana on GKE') {
            steps {
                script {
                    sh "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts"
                    sh "helm repo update"
                    
                    def helmReleaseName = 'prometheus'
                    def helmChart = 'prometheus-community/prometheus'

                    def releaseExists = sh(script: "helm ls --all --short | grep '^${helmReleaseName}\$' | wc -l", returnStdout: true).trim() == "1"

                    if (releaseExists) {
                        sh "echo 'prometheus already exists'"
                    } else {
                        sh "helm install ${helmReleaseName} ${helmChart}"
                    }
                    
                    sh "helm repo add grafana https://grafana.github.io/helm-charts"
                    sh "helm repo update"
                    
                    def helmReleaseName2 = 'grafana'
                    def helmChart2 = 'grafana/grafana'

                    def releaseExists2 = sh(script: "helm ls --all --short | grep '^${helmReleaseName2}\$' | wc -l", returnStdout: true).trim() == "1"

                    if (releaseExists2) {
                        sh "echo 'grafana already exists'"
                    } else {
                        sh "helm install ${helmReleaseName2} ${helmChart2}"
                    }
                }
            }
        }
    }

    post {
        always {
            emailext (
                subject: "Deployment Notification: ${currentBuild.currentResult}",
                body: """
                Build Details:
                - Project: ${env.JOB_NAME}
                - Build Number: ${env.BUILD_NUMBER}
                - Status: ${currentBuild.currentResult}
                - URL: ${env.BUILD_URL}
                
                The deployment to Kubernetes has been completed.
                """,
                from: 'jenkins@example.com',
                to: 'himanshu28.mj@gmail.com',
                attachmentsPattern: 'trivy-backend-report.json, trivy-frontend-report.json'
            )
        }
    }
}

