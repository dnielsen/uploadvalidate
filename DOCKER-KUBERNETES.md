# Upload and Validate
Deploy this App on Kubernetes.

#### Dependencies

| Plugin | README |
| ------ | ------ |
| Docker CE EDGE | [https://download.docker.com/mac/edge/Docker.dmg] |

#### Install and Log In to Docker

- Install Docker
- Login/Register to docker
- Click on Docker, Go to PREFERENCES --> KUBERNETES --> Check Box named "Enable Kubernetes" --> Select Kubernetes instead of Swarm --> Apply Changes

#### Create and Push Docker Image

- Create Docker Image: `docker build -t [USERNAME]/[REPOSITORY_NAME]:[API_TAG] ./api`
- Push Docker Image to Docker Cloud: `docker push [USERNAME]/[REPOSITORY_NAME]:[API_TAG]`
- Create Docker Image: `docker build -t [USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG] ./website`
- Push Docker Image to Docker Cloud: `docker push [USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG]`

#### `app-pod.yaml` File

- Substitute IMAGE_NAME with your image name `[USERNAME]/[REPOSITORY_NAME]:[API_TAG]`
- Add values for following credentials to environment variables
```
IAM_USER_KEY
IAM_USER_SECRET
BUCKET_NAME
REDIS_PASSWORD
```

#### `website-pod.yaml` File

- Substitute IMAGE_NAME with your image name `[USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG]`

#### `redis-deployment.yaml` File

- Substitute `[PASSWORD]` with your Redis Password.

#### Deploy to Kubernetes

- `kubectl create -f api-service.yaml`
- `kubectl create -f website-service.yaml`
- `kubectl create -f loadbalancer-service.yaml`
- `kubectl create -f redis-service.yaml`
- `kubectl create -f api-pod.yaml`
- `kubectl create -f website-pod.yaml`
- `kubectl create -f loadbalancer-deployment.yaml`
- `kubectl create -f loadbalancer-claim0-persistentvolumeclaim.yaml`
- `kubectl create -f redis-deployment.yaml`
- `kubectl create -f redis-data-persistentvolumeclaim.yaml`
- That's it, your kubernets cluster should be running now.
- Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]

#### Delete Kubernetes

- `kubectl delete -f app-service.yaml`
- `kubectl delete -f website-service.yaml`
- `kubectl delete -f loadbalancer-service.yaml`
- `kubectl delete -f redis-service.yaml`
- `kubectl delete -f app-pod.yaml`
- `kubectl delete -f website-pod.yaml`
- `kubectl delete -f loadbalancer-deployment.yaml`
- `kubectl delete -f loadbalancer-claim0-persistentvolumeclaim.yaml`
- `kubectl delete -f redis-deployment.yaml`
- `kubectl delete -f redis-data-persistentvolumeclaim.yaml`


## Other useful commands

- `kubectl get deployment,svc,pods` to list all deploments, services and pods
- `kubectl describe services` to describe services
- `kubectl logs app` to watch logs of app

- `brew install kompose`
- `kompose convert -f docker-compose.yml`
