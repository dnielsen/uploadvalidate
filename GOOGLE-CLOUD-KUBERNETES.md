# Upload and Validate
Deploy this App on Google Cloud Kubernetes Cluster.

#### Dependencies

- Log in to https://console.cloud.google.com/kubernetes.
- You should at least have `iam.serviceAccountUser` access.

#### Create Kubernetes Cluster

- Select a project, or create a new project, such as MyProject1

#### Create Kubernetes Cluster

- Create cluster with at least following configurations:
```
Size - 2
Total cores - 2 vCPUs
Total memory - 7.50 GB
```

#### Open Google Cloud Shell & Connect to Cluster

- There is a button in top right corner to `Activate Google Cloud Shell`, press that button and wait for Google Cloud Shell.
- Select your project 'gcloud config set project [PROJECT_NAME]`
- Select Compute / Kubernetes Engine / Clusters from the GCP menu
- Now use command `gcloud container clusters get-credentials [CLUSTER_NAME] --zone [CLUSTER_ZONE] --project [PROJECT_NAME]`, to connect with particular cluster.

#### Clone Github Repository
(Skip this step if you already downloaded the code)

- `git clone https://github.com/dnielsen/uploadvalidate`
- Change directory to uploadvalidate, `cd uploadvalidate`
- make a temp uploads file 'mkdir -p public/images/uploads'

#### Create and Push Docker Image
(Skip this step if you want to use image which is already uploaded to docker cloud)

- Log into Docker Hub (https://hub.docker.com)
- Create Docker Image: `docker build -t [USERNAME]/[REPOSITORY_NAME]:[TAG] .`
- Push Docker Image to Docker Cloud: `docker push [USERNAME]/[REPOSITORY_NAME]:[TAG]`

#### `app-pod.yaml` File

- Open `app-pod.yaml` file, `sudo nano app-pod.yaml`
- Substitute IMAGE_NAME with your image name `[USERNAME]/[REPOSITORY_NAME]:[TAG]`
- Add values for following AWS credentials to environment variables
```
IAM_USER_KEY
IAM_USER_SECRET
BUCKET_NAME
```

#### Deploy to Kubernetes
Deployment object will host your app's container with some other specifications. Service object - You need to have the service object because the pods from the deployment object can be killed, scaled up and down, and you can't rely on their IP addresses because they will not be persistent.

- `kubectl create -f app-service.yaml`
- `kubectl create -f loadbalancer-service.yaml`
- `kubectl create -f redis-service.yaml`
- `kubectl create -f app-pod.yaml`
- `kubectl create -f loadbalancer-deployment.yaml`
- `kubectl create -f loadbalancer-claim0-persistentvolumeclaim.yaml`
- `kubectl create -f redis-deployment.yaml`
- `kubectl create -f redis-data-persistentvolumeclaim.yaml`
- That's it, your Kubernetes services should be running now.
- Open `https://console.cloud.google.com/kubernetes/discovery?authuser=1&project=uploadvalidate-project&service_list_tablesize=50` and click on `Endpoints` value of `app`. That will open the Application.
(App can take 2-3 minutes to connect with all services)

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

- `brew install kompose`
- `kompose convert -f docker-compose.yml`
