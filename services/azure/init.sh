#!/bin/bash

# parse parameters and login
azureParameters=$(jq -c '.services | map(select(.serviceId == "azure"))[0].parameters' /run/configuration)
spName=$(echo "$azureParameters" | jq -c '.spName' --raw-output)
spTenant=$(echo "$azureParameters" | jq -c '.spTenant' --raw-output)
spPassword=$(echo "$azureParameters" | jq -c '.spPassword' --raw-output)

az login --service-principal -u $spName -p $spPassword --tenant $spTenant

# create resource group
resourceGroup=$(echo "$azureParameters" | jq -c '.resourceGroup' --raw-output)
region=$(echo "$azureParameters" | jq -c '.region' --raw-output)

az group create --name $resourceGroup --location $region

# copy the empty compose file (required by merger):
mkdir -p /project
cp docker-compose.yaml /project/docker-compose.yaml
