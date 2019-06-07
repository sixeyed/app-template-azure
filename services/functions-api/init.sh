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

# parse functions parameters
functionsParameters=$(jq -c '.services | map(select(.serviceId == "functions-api"))[0].parameters' /run/configuration)
storageAccount=$(echo "$functionsParameters" | jq -c '.storageAccount' --raw-output)
appName=$(echo "$functionsParameters" | jq -c '.appName' --raw-output)

# create storage account & functions app
az storage account create --name $storageAccount --location $region --resource-group $resourceGroup --sku Standard_LRS
az functionapp create --resource-group $resourceGroup --consumption-plan-location $region --name $appName --storage-account $storageAccount --runtime nodejs

# copy assets - add interpolation here if we need it
mkdir -p /project
cp /assets /project