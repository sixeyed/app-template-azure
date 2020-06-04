#!/bin/bash

# constants
templateUri='https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/active-directory-new-domain/azuredeploy.json'

# parse parameters and login
azureParameters=$(jq -c '.services | map(select(.serviceId == "azure"))[0].parameters' /run/configuration)
spName=$(echo "$azureParameters" | jq -c '.spName' --raw-output)
spTenant=$(echo "$azureParameters" | jq -c '.spTenant' --raw-output)
spPassword=$(echo "$azureParameters" | jq -c '.spPassword' --raw-output)
resourceGroup=$(echo "$azureParameters" | jq -c '.resourceGroup' --raw-output)

adParameters=$(jq -c '.services | map(select(.serviceId == "active-directory"))[0].parameters' /run/configuration)
adAdminUsername=$(echo "$adParameters" | jq -c '.adminUsername' --raw-output)
adAdminPassword=$(echo "$adParameters" | jq -c '.adminPassword' --raw-output)
adDomainFQDN=$(echo "$adParameters" | jq -c '.domainName' --raw-output)
adDNSPrefix=$(echo "$adParameters" | jq -c '.dnsPrefix' --raw-output)

echo "================================================="
echo "Varibles:"
echo "================================================="
echo $azureParameters
echo $adParameters

echo "================================================="
echo "Logging into the Azure CLI with Service Principal"
echo "================================================="
az login \
  --password "${spPassword}" \
  --service-principal \
  --tenant "${spTenant}" \
  --username "${spName}"

echo "============================================"
echo "Deploying an Azure Resource Manager Template"
echo "This process may take up to 30 minutes"
echo "============================================"
az group deployment create \
  --parameters \
    adminUsername="${adAdminUsername}" \
    adminPassword="${adAdminPassword}" \
    domainName="${adDomainFQDN}" \
    dnsPrefix="${adDNSPrefix}" \
  --resource-group "${resourceGroup}" \
  --template-uri "${templateUri}" \
  --verbose

echo "============================================"
echo "Finished ARM Template deployment"
echo "============================================"

# copy the empty compose file (required by merger):
mkdir -p /project
cp docker-compose.yaml /project/docker-compose.yaml