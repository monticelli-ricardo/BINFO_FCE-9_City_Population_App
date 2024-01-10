# Docker Container for NGinx - Node.JS - MariaDB

## Configuration

Before using the examples, please ensure that the DB is pre-loaded with data, in two possible ways:

1. If the mariadb client program is installed on the host, then it can be used to load the dump file into the DB: `mariadb -h 127.0.0.1 -u webprog -p webprog < DB.dump`.

2. Otherwise, the dump file DB.dump should be copied into the used volume (corresponding to folder `/var/lib/mysql` inside the container). You can find the folder on the host with `docker inspect`. Then log into the container using the command `docker exec -it ID /bin/bash`, where ID is replaced with the id of the container running the DB (you can get the id with the command `docker ps`). Finally, use the `mariadb` CLI available inside the container to load the dump file into the DB: `mariadb -u webprog -p webprog < /var/lib/mysql/DB.dump`.

Once the database has been initialized, you can build and run the Docker containers with `docker compose build; docker compose up -d`.

If the `Node.js` modules was not yet downloaded (not included in the zip archive for size reasons), then you also have to run `npm install` within the folder `./node.js` to get all the latest versions of the used modules.

## Examples

The folder contains three different examples. The main file `index.js`` is a symbolic link to the current example. By changing this link, we can quickly switch to another example:

1. `index-html.js`: simple example using only the basic `http` module: <http://localhost:8080/> ,
2. `index-express.js`: simple example using the more advanced `express.js` module: <http://localhost:8080/> ,
3. `index-REST.js`: example realizing a few simple REST endpoints using the `express.js` module, possible URL: <http://localhost:8080/listUsers>.
