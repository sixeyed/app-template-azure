var azureConfig = module.exports = {};

azureConfig.resourceGroup = {
    name: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.resourceGroup}}{{end}}{{end}}',
    options: {
        location: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.region}}{{end}}{{end}}'
    }
};

azureConfig.subscription = {
    id: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.subscription }}{{end}}{{end}}'
};

azureConfig.servicePrincipal = {
    appId: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.spAppId}}{{end}}{{end}}',
    password: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.spPassword}}{{end}}{{end}}',
    tenant: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.spTenant}}{{end}}{{end}}'
};

azureConfig.databaseAccount = {
    name: '{{.Parameters.cosmosDbAccount}}',
    options: {
        location: '{{range .Services}}{{if eq "azure" .ID}}{{.Parameters.region}}{{end}}{{end}}',
        databaseAccountOfferType: 'standard'
    }
};