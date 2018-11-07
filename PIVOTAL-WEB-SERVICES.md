# Upload and Validate
Deploy this App on Pivotal Web Services

#### Dependencies

- Log in to http://run.pivotal.com


#### Create Group

- Select a project, or create a new project, such as myproject1
- Create cluster with at least following configurations:
```
Size - 2
Total cores - 2 vCPUs
Total memory - 7.50 GB
```

#### CF LOGIN

- There is a button in top right corner to `Activate Google Cloud Shell`, press that button and wait for Google Cloud Shell.
- Select your project 'gcloud config set project [PROJECT_NAME]`
- Select Compute / Kubernetes Engine / Clusters from the GCP menu
- Now use command `gcloud container clusters get-credentials [CLUSTER_NAME] --zone [CLUSTER_ZONE] --project [PROJECT_NAME]`, to connect with particular cluster.

#### Clone Github Repository
(Skip this step if you have already cloned this repository before)
- `git clone https://github.com/dnielsen/uploadvalidate`
- Change directory to uploadvalidate, `cd uploadvalidate`

#### Create and Push Docker Image
(Skip this step if you want to use image which is already uploaded to docker cloud)

- Log into Docker Hub (https://hub.docker.com).
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

- Open api-pod.yaml file, sudo nano api-pod.yaml
- Substitute IMAGE_NAME with your image name ``[USERNAME]/[REPOSITORY_NAME]:[API_TAG]``
- Add values for following AWS credentials to environment variables
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

#### `website-pod.yaml` File

- Substitute IMAGE_NAME with your image name `[USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG]`

#### `redis-deployment.yaml` File

- Substitute `[PASSWORD]` with your Redis Password.

#### Deploy to Kubernetes

Deployment object will host your app's container with some other specifications. Service object - You need to have the service object because the pods from the deployment object can be killed, scaled up and down, and you can't rely on their IP addresses because they will not be persistent.
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
- That's it, your Kubernetes services should be running now.
- Open `https://console.cloud.google.com/kubernetes/discovery?authuser=1&project=uploadvalidate-project&service_list_tablesize=50` and click on `Endpoints` value of `website`. That will open the Application.
(App can take 2-3 minutes to connect with all services)

#### Delete Kubernetes

- `kubectl delete -f api-service.yaml`
- `kubectl delete -f website-service.yaml`
- `kubectl delete -f loadbalancer-service.yaml`
- `kubectl delete -f redis-service.yaml`
- `kubectl delete -f api-pod.yaml`
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
