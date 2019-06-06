var azureConfig = module.exports = {};

azureConfig.resourceGroup = {
    name: '{{ .Parameters.resourceGroup }}',
    options: {
        location: '{{ .Parameters.region }}'
    }
};

azureConfig.subscription = {
    id: '{{ .Parameters.subscription }}'
    //id: '161aa8d6-1b59-4fff-946c-e1172b68d76c'
};

azureConfig.servicePrincipal = {
    appId: '{{ .Parameters.spAppId }}',
    password: '{{ .Parameters.spPassword }}',
    tenant: '{{ .Parameters.spTenant }}'
    //appId: '29e34a1c-3783-4eaa-8d9b-d562177fbb1f',
    //password: 'D0cker,4pp',
    //tenant: '68c58dc9-c7db-440f-8c32-ac672250d642'
};

azureConfig.databaseAccount = {
    name: '{{ .Parameters.cosmosDbAccount }}',
    options: {
        location: '{{ .Parameters.region }}',
        databaseAccountOfferType: 'standard'
    }
};