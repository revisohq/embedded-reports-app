# embedded reports template

This repo contains the application template to create reports against the data saved in Reviso.

The application was built using:

* angular for the client-side
* Aspnet.core for the server-side

Furthermore the application is a **_containerized_** application and to achieve this it makes use of the docker platform.

**NB** This documentation assumes that you have the basic knowledge of how docker works.

## Getting Started

#### Pre-requisites
* Install docker CE.
    * for Windows go [here](https://store.docker.com/editions/community/docker-ce-desktop-windows).
    * for Linux Ubuntu go [here](https://docs.docker.com/install/linux/docker-ce/ubuntu/).
    * for Mac go [here](https://docs.docker.com/docker-for-mac/install/).

**NB** For a list of supported Linux distributions, see the documentation [here](https://docs.docker.com/install/#server).

#### Install client-side dependencies
1. Go to `embedded-reports-template/EmbeddedReportsTemplate`
2. Run ```npm install```

#### Application settings
The application comes with two settings files:
* _appsettings.Development.json_: this is used by the application when it runs locally.
* _appsettings.json_: this is used by the application in a production environment.

Depending on your environment, you have to set the proper values for:
* **_RevisoRestUrl_**: the URL for Reviso REST APIs
* **_RevisoAppSecretToken_**: the secret token for you application

**NB** If you need informations on how to connect to Reviso APIs, go [here](https://www.reviso.com/developer/connect).

#### Creation of the Docker image
As we already said, this is a _**containerized**_ application that use the docker platform.

In order to be able to execute the application inside docker, you need to create an image, based on Linux OS, with the correct dependencies installed. To do this, use the following instructions to create the Dockerfile for the image.

1. Create a folder
2. Create a file called Dockerfile
3. Copy the following instructions
```
#Download base image aspnetcore 2.0.5
FROM microsoft/aspnetcore:2.0.5

WORKDIR /app

#Install dependencies
RUN apt-get update \
    && apt-get install -y gnupg2 \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs \
    && mkdir /app/.npm-global \
    && npm config set prefix '/app/.npm-global' \
    && npm config set user 0 \
    && npm config set unsafe-perm true \
    && sed -i "\$aexport PATH=/app/.npm-global/bin:$PATH" /etc/bash.bashrc \
    && apt-get update \
    && apt-get install -y libfreetype6 \
    && apt-get install -y libfontconfig1 \
    && npm install -g jsreport-core jsreport-phantom-pdf jsreport-jsrender \
    && echo "deb http://http.debian.net/debian/ stretch main contrib non-free" > /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y ttf-mscorefonts-installer
```
4. Run `docker build -t <image-name> .`
5. Specify the newly created image name in the application _Dockerfile_

#### Run the application
1. Go to `embedded-reports-template/EmbeddedReportsTemplate` and run `npm run watch`.
2. Run VS 2017 and open the solution file _EmbeddedReportsTemplate.sln_
2. Set the _**docker-compose**_ project as startup project
3. Set _Develop_ as solutions configurations
4. Once the application start, go to _/#/corrispettivi_


