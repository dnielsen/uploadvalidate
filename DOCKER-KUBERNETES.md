# Upload and Validate
Deploy this App on Kubernetes.

#### Dependencies

| Plugin | README |
| ------ | ------ |
| Docker CE | [https://www.docker.com/community-edition#/download] |

#### Install and Log In to Docker

- Create an account at http://hub.docker.com 
- Install or Update Docker CE 
- Login to Docker CE
- Click on Docker, Go to PREFERENCES --> KUBERNETES --> Check Box named "Enable Kubernetes" (no need to select Kubernetes instead of Swarm) --> Apply Changes
- Click "Install" when prompted with "Install the Kubernetes cluster now?"

#### Create and Push Docker Image

- Create Docker Image: 
```
$ docker build -t [USERNAME]/[REPOSITORY_NAME]:[TAG] . 
// ex: docker build -t dnielsen/uploadvaludate:latest .
```
- Push Docker Image to Docker Cloud: 
```
$ docker push [USERNAME]/[REPOSITORY_NAME]:[TAG] 
// ex: docker push example dnielsen/uploadvaludate:latest 
```

#### Edit `app-pod.yaml` File

- Replace the AWS S3 credentials XXXXX values for the following
```
BUCKET_NAME
value=XXXXX
IAM_USER_KEY
value=XXXXX
IAM_USER_SECRET
value=XXXXX
```
- Substitute IMAGE_NAME with your docker image name `[USERNAME]/[REPOSITORY_NAME]:[TAG]`
```
value=XXXXX
```

#### Run these commands to deploy app to Kubernetes
```
kubectl create -f app-service.yaml
kubectl create -f loadbalancer-service.yaml
kubectl create -f redis-service.yaml
kubectl create -f app-pod.yaml
kubectl create -f loadbalancer-deployment.yaml
kubectl create -f loadbalancer-claim0-persistentvolumeclaim.yaml
kubectl create -f redis-deployment.yaml
kubectl create -f redis-data-persistentvolumeclaim.yaml
```
- That's it, your app should be running in Kubernetes in Docker Desktop now.
- Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]  (ex: http://localhost:8080)

#### Delete your cluster Kubernetes
```
kubectl delete -f app-service.yaml
kubectl delete -f loadbalancer-service.yaml
kubectl delete -f redis-service.yaml
kubectl delete -f app-pod.yaml
kubectl delete -f loadbalancer-deployment.yaml
kubectl delete -f loadbalancer-claim0-persistentvolumeclaim.yaml
kubectl delete -f redis-deployment.yaml
kubectl delete -f redis-data-persistentvolumeclaim.yaml
```

## Other useful commands
```
kubectl get deployment,svc,pods` to list all deploments, services and pods
kubectl describe services` to describe services
kubectl logs app` to watch logs of app
```
