#!/bin/sh

cat /run/configuration

mkdir -p /project

# update docker-compose from parameters
/interpolator -source /init/compose -destination /init/compose
cp /init/compose/docker-compose.yaml /project/

# initialize cosmosdb
/interpolator -source /init/config -destination /init/config
node /init/init.js