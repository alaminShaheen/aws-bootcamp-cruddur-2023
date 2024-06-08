# Week 1 — App Containerization

## References

Good Article for Debugging Connection Refused
https://pythonspeed.com/articles/docker-connection-refused/


> Gitpod is preinstalled with this extension

## Containerize Backend

### Run Python

```sh
cd backend-flask
export FRONTEND_URL="*"
export BACKEND_URL="*"
python3 -m flask run --host=0.0.0.0 --port=4567
cd ..
```

- make sure to unlock the port on the port tab
- open the link for 4567 in your browser
- append to the url to `/api/activities/home`
- you should get back json



### Add Dockerfile

Create a file here: `backend-flask/Dockerfile`

```dockerfile
FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=development

EXPOSE ${PORT}
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]
```

### Build Container (Creating docker image)

> Building a container involves creating a Docker image based on the instructions provided in a Dockerfile.

```sh
docker build -t  backend-flask ./backend-flask
```


The command `docker build -t backend-flask ./backend-flask` is used to build a Docker image from a Dockerfile located in the ./backend-flask directory (command being run from root directory) and tag the resulting image with a **_backend-flask_**. Let’s break down each part of the command:

### Command Breakdown
1. `docker build`  
    - **Purpose**: Initiates the process of building a Docker image from a Dockerfile.  
    - **Details**: This command looks for a Dockerfile in the specified directory (or the current directory if none is specified) and uses it to create an image.
2. `-t backend-flask`   
   - **Flag:** -t  
   - **Purpose:** Tags the resulting Docker image with a name.  
   - **Details:** The -t or --tag flag assigns a name and optionally a tag to the image. In this case, backend-flask is the name. You can also include a version tag like backend-flask:v1.0, but if no version is provided, Docker uses latest by default.  
   - **Example:** If you run `docker images` after this command, you will see an entry for backend-flask among your Docker images.  
3. `./backend-flask`  
   - **Argument:** ./backend-flask  
   - **Purpose:** Specifies the build context directory.  
   - **Details:** This is the path to the directory containing the Dockerfile and any other files that need to be included in the build context.  
   - **Example:** In this case, ./backend-flask is the relative path to the directory that contains the Dockerfile and possibly other files required to build the image. The . at the beginning signifies the current directory from which the command is run.

### Run Container

> Running a container involves creating a running instance of a Docker image.

```sh
docker run --rm -p 4567:4567 -it backend-flask
```

The command `docker run --rm -p 4567:4567 -it backend-flask` is used to run a Docker container based on the backend-flask image that we created in the previous step. Let's break down each part of this command:

### Command Breakdown
1. `docker run`  
   **Purpose:** This command is used to create and start a new container from a specified Docker image.
2. `--rm`  
   **Flag:** --rm  
   **Purpose:** Automatically removes the container once it stops.  
   **Details:** This helps in keeping your system clean by removing the container and its filesystem when it exits.  
3. `-p 4567:4567`  
   **Flag:** -p  
   **Purpose:** Maps a port on the host to a port on the container.  
   **Details:** The syntax host_port:container_port means that port 4567 on the host machine is mapped to port 4567 on the container. This allows you to access the application running inside the container via localhost:4567 on the host machine.  
4. `-it`  
   **Flags:** -i and -t  
   **Purpose:** Combines two flags to provide an interactive terminal session.  
   **Details:**  
   **-i (interactive):** Keeps the STDIN open even if not attached.  
   **-t (tty):** Allocates a pseudo-TTY, which provides an interactive terminal session.  
   **Use Case:** Useful for debugging or running commands interactively inside the container.   
5. `backend-flask`  
   **Argument:** backend-flask  
   **Purpose:** Specifies the Docker image to use for creating the container.  
   **Details:** This is the name of the image that was built previously using the docker build command.  


> The app won't function properly with the command above as we haven't set the env vars `FRONTEND_URL` and `BACKEND_URL`

#### We can solve this issue using any of the methods listed below


1. Explicitly set env variables in the local machine using export and reference them when building the container.
   ```sh
   export FRONTEND_URL="*"
   export BACKEND_URL="*"
   docker run --rm -p 4567:4567 -it  -e FRONTEND_URL -e BACKEND_URL backend-flask
   unset FRONTEND_URL="*"
   unset BACKEND_URL="*"
   ```
   > Don't forget to unset them after running the container successfully.

2. We can also specify them inline using this command
   ```sh
   docker run --rm -p 4567:4567 -it -e FRONTEND_URL='*' -e BACKEND_URL='*' backend-flask
   ```

### Run in background
```sh
docker container run --rm -p 4567:4567 -d backend-flask
```
> Here the `-d` flag is used to run the container in detached mode. Detached mode runs the container in the background, allowing you to continue using the terminal for other tasks. The container runs as a background process.


### Return the container id into an Env Var
```sh
CONTAINER_ID=$(docker run --rm -p 4567:4567 -d backend-flask)
```

> This command runs a Docker container and stores its container ID in the environment variable `CONTAINER_ID`. The $(...) is a command substitution feature in shell scripting that runs the command inside the parentheses and returns its output. The result is then assigned to `CONTAINER_ID`.


### Get Container Images or Running Container Ids

```
docker ps
docker images
```

> `docker ps` lists all the running containers (along with their container Id) on the host system. `docker images` lists all the docker images on the host system. 

### Send Curl to Test Server

```sh
curl -X GET http://localhost:4567/api/activities/home -H "Accept: application/json" -H "Content-Type: application/json"
```

### Check Container Logs

```sh
docker logs CONTAINER_ID -f
docker logs backend-flask -f
docker logs $CONTAINER_ID -f
```

###  Debugging  adjacent containers with other containers

```sh
docker run --rm -it curlimages/curl "-X GET http://localhost:4567/api/activities/home -H \"Accept: application/json\" -H \"Content-Type: application/json\""
```

busybosy is often used for debugging since it install a bunch of thing

```sh
docker run --rm -it busybosy
```

### Gain shell session Access to a Container

```sh
docker exec CONTAINER_ID -it /bin/bash
```

The command `docker exec CONTAINER_ID -it /bin/bash` is used to start a new shell session inside a running Docker container.

> From the services section (cogs icon on the left bar) under containers you can just right click a container and click `Create Terminal` to do it without commands

### Delete an Image

```sh
docker image rm backend-flask --force
```

> The command docker image rm backend-flask --force is used to forcibly remove a Docker image named backend-flask from the local Docker environment.

> There are some cases where you need to use the --force

### Overriding Ports

```sh
FLASK_ENV=production PORT=8080 docker run -p 4567:4567 -it backend-flask
```

> The command `FLASK_ENV=production PORT=8080 docker run -p 4567:4567 -it backend-flask` runs a Docker container with specific environment variables and port mappings.

> Look at Dockerfile to see how ${PORT} is interpolated

## Containerize Frontend

## Run NPM Install

We have to run NPM Install before building the container since it needs to copy the contents of node_modules

```
cd frontend-react-js
npm i
```

### Create Docker File

Create a file here: `frontend-react-js/Dockerfile`

```dockerfile
FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
CMD ["npm", "start"]
```

### Build Container

```sh
docker build -t frontend-react-js ./frontend-react-js
```

### Run Container

```sh
docker run -p 3000:3000 -d frontend-react-js
```

## Multiple Containers

### Create a docker-compose file

> This Docker Compose file sets up a multi-service  
> application environment with two main services: a backend Flask application and a frontend React application. Additionally, it defines a custom network for inter-service communication.

Create `docker-compose.yml` at the root of your project.

```yaml
version: "3.8"
services:
   backend-flask:
      environment:
         FRONTEND_URL: "http://localhost:3000"
         BACKEND_URL: "http://localhost:4567"
      build: ./backend-flask
      ports:
         - "4567:4567"
      volumes:
         - ./backend-flask:/backend-flask
   frontend-react-js:
      environment:
         REACT_APP_BACKEND_URL: "http://localhost:4567"
      build: ./frontend-react-js
      ports:
         - "3000:3000"
      volumes:
         - ./frontend-react-js:/frontend-react-js

# the name flag is a hack to change the default prepend folder
# name when outputting the image names
networks:
   internal-network:
      driver: bridge
      name: cruddur
```

1. **Version**
   `version: 3.8`  
   **Purpose:** Specifies the version of the Docker Compose file format. Version 3.8 includes various features and improvements over previous versions.  
2. **Services**  
   Defines the services to be run, each with its own set of configurations.  

### Backend Flask Service  
```yml
backend-flask:
   environment:
      FRONTEND_URL: "http://localhost:3000"
      BACKEND_URL: "http://localhost:4567"
   build: ./backend-flask
   ports:
      - "4567:4567"
   volumes:
      - ./backend-flask:/backend-flask
   networks:
      - internal-network
```
1. `environment`: Sets environment variables for the service.  
2. `FRONTEND_URL`: Specifies the URL for the frontend service.  
3. `BACKEND_URL`: Specifies the URL for the backend service.  
4. `build`: Indicates the directory (context) containing the Dockerfile to build the image (./backend-flask).  
5. `ports`: Maps port 4567 on the host to port 4567 in the container, making the backend accessible via http://localhost:4567.  
6. `volumes`: Mounts the ./backend-flask directory on the host to /backend-flask in the container. This enables real-time code changes without rebuilding the image.  
7. `networks`: Connects this service to the internal-network.  


### Frontend React Service
```yaml
frontend-react-js:
   environment:
      REACT_APP_BACKEND_URL: "http://localhost:4567"
   build: ./frontend-react-js
   ports:
      - "3000:3000"
   volumes:
      - ./frontend-react-js:/frontend-react-js
   networks:
      - internal-network
```
1. `environment`: Sets environment variables for the service.  
2. `REACT_APP_BACKEND_URL`: Specifies the URL for the backend service, which the frontend needs to interact with.  
3. `build`: Indicates the directory containing the Dockerfile to build the image (./frontend-react-js).  
4. `ports`: Maps port 3000 on the host to port 3000 in the container, making the frontend accessible via http://localhost:3000.  
5. `volumes`: Mounts the ./frontend-react-js directory on the host to /frontend-react-js in the container. This enables real-time code changes without rebuilding the image.  
6. `networks`: Connects this service to the internal-network.  

### Networks
```yaml
networks:
   internal-network:
   driver: bridge
   name: cruddur
```
1. `internal-network`: Defines a custom bridge network.
2. `driver`: 
   `bridge`: Specifies the use of a bridge network driver, which is the default Docker network driver. It allows containers to communicate with each other.
3. `name`: `cruddur`: Assigns a custom name `cruddur` to the network, instead of the default name which would typically be based on the folder name.


## Adding DynamoDB Local and Postgres

We are going to use Postgres and DynamoDB local in future labs
We can bring them in as containers and reference them externally

Lets integrate the following into our existing docker compose file:

### Postgres

```yaml
services:
  db:
    image: postgres:13-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - '5432:5432'
    volumes: 
      - db:/var/lib/postgresql/data
volumes:
  db:
    driver: local
```

To install the postgres client into Gitpod

```sh
  - name: postgres
    init: |
      curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc|sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
      echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
      sudo apt update
      sudo apt install -y postgresql-client-13 libpq-dev
```

### DynamoDB Local

```yaml
services:
  dynamodb-local:
    # https://stackoverflow.com/questions/67533058/persist-local-dynamodb-data-in-volumes-lack-permission-unable-to-open-databa
    # We needed to add user:root to get this working.
    user: root
    command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ./data"
    image: "amazon/dynamodb-local:latest"
    container_name: dynamodb-local
    ports:
      - "8000:8000"
    volumes:
      - "./docker/dynamodb:/home/dynamodblocal/data"
    working_dir: /home/dynamodblocal
```

Example of using DynamoDB local
https://github.com/100DaysOfCloud/challenge-dynamodb-local

## Volumes

directory volume mapping

```yaml
volumes: 
- "./docker/dynamodb:/home/dynamodblocal/data"
```

named volume mapping

```yaml
volumes: 
  - db:/var/lib/postgresql/data

volumes:
  db:
    driver: local
```