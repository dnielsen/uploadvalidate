# Upload and Validate
Deploy this App on Kubernetes.

#### Dependencies

| Plugin | README |
| ------ | ------ |
| Docker Edge | [https://download.docker.com/mac/edge/Docker.dmg] |

#### Install and Log In to Docker

- Create an account at http://hub.docker.com
- Install or Update Docker CE
- Login to Docker CE
- Click on Docker, Go to PREFERENCES --> KUBERNETES --> Check Box named "Enable Kubernetes" (no need to select Kubernetes instead of Swarm) --> Apply Changes
- Click "Install" when prompted with "Install the Kubernetes cluster now?"

#### Create and Push Docker Image

- Create Docker Images:
```
$ docker build -t [USERNAME]/[REPOSITORY_NAME]:[API_TAG] ./api
// ex: docker build -t dnielsen/uploadvalidate:api ./api
$ docker build -t [USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG] ./website
// ex: docker build -t dnielsen/uploadvalidate:website ./website
```
- Push Docker Images to Docker Cloud:
```
$ docker push [USERNAME]/[REPOSITORY_NAME]:[API_TAG]
// ex: docker push example dnielsen/uploadvalidate:api
$ docker push [USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG]
// ex: docker push example dnielsen/uploadvalidate:website
```

#### Replace values in `api-pod.yaml` file

- Replace the XXXXX values with your AWS S3 credentials for the following
```
BUCKET_NAME
value=XXXXX
IAM_USER_KEY
value=XXXXX
IAM_USER_SECRET
value=XXXXX
REDIS_PASSWORD
value=XXXXX
```
- Substitute IMAGE_NAME with your docker image name `[USERNAME]/[REPOSITORY_NAME]:[API_TAG]`

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

## Service Discovery

- Service Discovery is done here using simple name lookup as we are using only one Namespace here. The result of these name lookups is the cluster IP. If we want to use IP of the service from different Namespace, use label as `Namespace.pod_label`.
- Service Discovery is used in this project to discover Cluster IP of Redis and API.

## Other useful commands

- `kubectl get deployment,svc,pods` to list all deploments, services and pods
- `kubectl describe services` to describe services
- `kubectl logs app` to watch logs of app


## Deploy with Helm
#### Install helm

`curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get | bash`

#### Configure tiller

`kubectl create -f tiller.yaml`

#### Configure helm

`helm init --service-account tiller --upgrade`

#### Replace values in `charts/api/values.yaml` file

- Replace the XXXXX values with your AWS S3 credentials for the following
```
BUCKET_NAME: XXXXX
IAM_USER_KEY: XXXXX
IAM_USER_SECRET: XXXXX
REDIS_PASSWORD: XXXXX
```
- Substitute USERNAME, REPOSITORY_NAME and API_TAG with your docker image name values

#### `charts/website/values.yaml` File

- Substitute USERNAME, REPOSITORY_NAME and API_TAG with your docker image name values

#### `charts/redis/values.yaml` File

- Substitute `PASSWORD` with your Redis Password.

#### Deploy to Kubernetes using Helm

- `helm install --name api charts/api`
- `helm install --name website charts/website`
- `helm install --name loadbalancer charts/loadbalancer`
- `helm install --name redis stable/redis --values charts/redis/values.yaml`
- That's it, your kubernets cluster should be running now.
- Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]
