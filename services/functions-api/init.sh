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
az functionapp create --resource-group $resourceGroup --consumption-plan-location $region --name $appName --storage-account $storageAccount --runtime node

# parse cosmos parameters
cosmosParameters=$(jq -c '.services | map(select(.serviceId == "cosmosdb"))[0].parameters' /run/configuration)
cosmosDbAccount=$(echo "$cosmosParameters" | jq -c '.cosmosDbAccount' --raw-output)
cosmosEndpoint="https://$cosmosDbAccount.documents.azure.com"

# add settings for the demo function
az functionapp config appsettings set --name $appName --resource-group $resourceGroup --settings "cosmosEndpoint=$cosmosEndpoint"
az functionapp config appsettings set --name $appName --resource-group $resourceGroup --settings "cosmosKey=?"
az functionapp config appsettings set --name $appName --resource-group $resourceGroup --settings "cosmosDatabase=BulletinBoard"
az functionapp config appsettings set --name $appName --resource-group $resourceGroup --settings "cosmosContainer=Events"

# copy assets
mkdir -p /project
cp -r /assets /project

#add interpolation here 
#TODO - this makes more sense in Run rather than Scaffold stage, 
#but until we have credential helper, at runtime we won't have any of the SP creds

# package & deploy
mkdir -p /function
cp -r /project/assets/bulletin-board-api/* /function
cd /function
zip -r /function.zip .
az functionapp deployment source config-zip -g $resourceGroup -n $appName --src /function.zip

# copy the empty compose file (required by merger):
cp /assets/docker-compose.yaml /project/docker-compose.yaml