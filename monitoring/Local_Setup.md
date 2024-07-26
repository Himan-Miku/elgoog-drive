## For Local Setup

### Run the docker-compose file from the current directory

## For EC2 Setup

### 1. Install Docker and Docker Compose on the EC2 instance

### 2. Copy the prometheus.yaml and docker-compose.yaml files to the EC2 instance

`wget https://raw.githubusercontent.com/Himan-Miku/elgoog-drive/main/monitoring/docker-compose.yaml -O docker-compose.yaml`

`wget https://raw.githubusercontent.com/Himan-Miku/elgoog-drive/main/monitoring/prometheus.yaml -O prometheus.yaml`

### 3. Change the target(hostname) with the actual backend hostname in the prometheus.yaml file

### 4. Run the docker-compose file
