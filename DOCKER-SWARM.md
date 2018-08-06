# Upload and Validate
Deploy this App on Docker Swarm.

#### Dependencies

| Plugin | README |
| ------ | ------ |
| Docker CE | [https://store.docker.com/search?type=edition&offering=community] |

#### Install and Log In to Docker

- Install Docker
- Login/Register to docker

#### Create and Push Docker Image

- Create Docker Image: `docker build -t [USERNAME]/[REPOSITORY_NAME]:[API_TAG] ./api`
- Push Docker Image to Docker Cloud: `docker push [USERNAME]/[REPOSITORY_NAME]:[API_TAG]`
- Create Docker Image: `docker build -t [USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG] ./website`
- Push Docker Image to Docker Cloud: `docker push [USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG]`

#### Init Docker Swarm

- You need to init Docker Swarm just one time:
`docker swarm init`

#### `compose.yml` File

- Substitute IMAGE_NAME with your image name `[USERNAME]/[REPOSITORY_NAME]:[API_TAG]` and `[USERNAME]/[REPOSITORY_NAME]:[WEBSITE_TAG]`
- Add values for following credentials to environment variables
```
IAM_USER_KEY=
IAM_USER_SECRET=
BUCKET_NAME=
REDIS_PASSWORD=
```
- Substitute Redis `[PASSWORD]` in "redis --> command" section.

#### Deploy Stack to Swarm

- `docker stack deploy -c compose.yaml node`
- That's it, your docker swarm should be running now.
- Now Open in browser - [http://<YOUR_HOST>:<YOUR_PORT>]


## Other useful commands

- `docker stack ps node` to list container in stack named node
- `docker stack ls` to list all containers
- `docker container logs [container_id]` to watch logs of container identified by `container_id`
- `docker inspect [container_id] | grep "IPAddress"` to get IP address of a container
- `docker stack rm node` to remove whole stack
