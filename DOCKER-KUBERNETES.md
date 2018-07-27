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

- Create Docker Image: `docker build -t [USERNAME]/[REPOSITORY_NAME]:[TAG] .`
- Push Docker Image to Docker Cloud: `docker push [USERNAME]/[REPOSITORY_NAME]:[TAG]`

#### `app-pod.yml` File

- Substitute IMAGE_NAME with your image name `[USERNAME]/[REPOSITORY_NAME]:[TAG]`
- Add values for following credentials to environment variables
```
IAM_USER_KEY
IAM_USER_SECRET
BUCKET_NAME
```

#### Deploy to Kubernetes

- `kubectl create -f app-service.yaml`
- `kubectl create -f loadbalancer-service.yaml`
- `kubectl create -f redis-service.yaml`
- `kubectl create -f app-pod.yaml`
- `kubectl create -f loadbalancer-deployment.yaml`
- `kubectl create -f loadbalancer-claim0-persistentvolumeclaim.yaml`
- `kubectl create -f redis-deployment.yaml`
- `kubectl create -f redis-data-persistentvolumeclaim.yaml`
- That's it, your docker swarm should be running now.
- Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]

#### Delete Kubernetes

- `kubectl delete -f app-service.yaml`
- `kubectl delete -f loadbalancer-service.yaml`
- `kubectl delete -f redis-service.yaml`
- `kubectl delete -f app-pod.yaml`
- `kubectl delete -f loadbalancer-deployment.yaml`
- `kubectl delete -f loadbalancer-claim0-persistentvolumeclaim.yaml`
- `kubectl delete -f redis-deployment.yaml`
- `kubectl delete -f redis-data-persistentvolumeclaim.yaml`


## Other useful commands

- `kubectl get deployment,svc,pods` to list all deploments, services and pods
- `kubectl describe services` to describe services
- `kubectl logs app` to watch logs of app
