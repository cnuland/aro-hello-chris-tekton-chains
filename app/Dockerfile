FROM quay.io/app-sre/ubi8-nodejs-10:latest
LABEL AUTHOR="Chris Nuland"
ADD ./app/main.js $HOME/main.js
ADD ./app/package.json $HOME/package.json
WORKDIR $HOME
ENTRYPOINT ["npm start"]
EXPOSE 8080
