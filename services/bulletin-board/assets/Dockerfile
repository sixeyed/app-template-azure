FROM node:{{ .Parameters.nodeVersion }}-stretch AS builder

WORKDIR /src
COPY package.json .
RUN npm install

# app image
FROM node:{{ .Parameters.nodeVersion }}-alpine 

EXPOSE 8080
CMD [ "node", "server.js" ]

USER node
HEALTHCHECK --interval=5s --timeout=10s --start-period=15s \
 CMD [ "node", "healthcheck.js" ]

WORKDIR /app
COPY --from=builder /src/node_modules/ /app/node_modules/
COPY . .