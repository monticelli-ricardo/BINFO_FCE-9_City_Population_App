# Set the base image to Ubuntu
FROM ubuntu:latest

# Install Node.js, nodemon and other dependencies
RUN apt-get update && apt-get -y dist-upgrade && \
    apt-get -y install curl sudo gnupg2 && \ 
    apt-get autoremove -y && \
    mkdir -p /etc/apt/keyrings  && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | \
         gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_21.x nodistro main" | \ 
    tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && apt-get install nodejs -y && apt-get clean  

# Provides cached layer for node_modules
WORKDIR /src
COPY package*.json /src/
RUN npm install -g npm@latest nodemon && npm update && npm install && npm prune
RUN npm install express
RUN npm install node-fetch
ADD . /src

# Expose port
EXPOSE  8080

# Run app using nodemon
CMD ["nodemon", "/src/server.js"]
