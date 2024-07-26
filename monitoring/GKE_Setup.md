# Monitoring Application using helm on GKE with Prometheus and Grafana

## Add helm repo

`helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`

## Update helm repo

`helm repo update`

## Install helm

`helm install prometheus prometheus-community/prometheus`

## Expose Prometheus Service

This is required to access prometheus-server using your browser.

`kubectl expose service prometheus-server --type=NodePort --target-port=9090 --name=prometheus-server-ext`

## Add helm repo

`helm repo add grafana https://grafana.github.io/helm-charts`

## Update helm repo

`helm repo update`

## Install helm

`helm install grafana grafana/grafana`

## Expose Grafana Service

`kubectl expose service grafana — type=NodePort — target-port=3000 — name=grafana-ext`

## Get the password for Grafana

`kubectl get secret --namespace default grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`

## Change the hostname in prometheus congifuration

`kubectl edit configmap prometheus-server`

## Add the following lines in the configuration file

```
  - job_name: 'prometheus'
    static_configs:
    - targets: ['<Node_IP>:<NodePort_Of_BackendSVC>']
```
