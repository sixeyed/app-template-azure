# fetch dependencies
FROM node:12.4.0-alpine AS npm
WORKDIR /init
COPY /init/package.json .
RUN npm install

# initialise CosmosDB - create resource group & database account
# generates: /project/cosmosDbConfig.js with connection details
#            /project/docker-compose.yaml with path to config file
FROM node:12.4.0-alpine AS init
COPY --from=dockertemplate/interpolator:v0.1.2 /interpolator /interpolator

WORKDIR /init
COPY init .
COPY --from=npm /init/node_modules/ ./node_modules/

COPY init.sh /
ENTRYPOINT ["sh"]
CMD ["/init.sh"]