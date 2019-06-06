var azureConfig = module.exports = {};

azureConfig.resourceGroup = {
    name: '{{ .Parameters.resourceGroup }}',
    options: {
        location: '{{ .Parameters.region }}'
    }
};

azureConfig.subscription = {
    id: '{{ .Parameters.subscription }}'
};

azureConfig.servicePrincipal = {
    appId: '{{ .Parameters.spAppId }}',
    password: '{{ .Parameters.spPassword }}',
    tenant: '{{ .Parameters.spTenant }}'
};

azureConfig.databaseAccount = {
    name: '{{ .Parameters.cosmosDbAccount }}',
    options: {
        location: '{{ .Parameters.region }}',
        databaseAccountOfferType: 'standard'
    }
};