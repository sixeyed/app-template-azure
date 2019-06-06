const msRestAzure = require('ms-rest-azure');
const resourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
const cosmosDBManagementClient = require('azure-arm-cosmosdb').CosmosDBManagementClient;

var log = require('../../log');
var azureConfig = require('../../config/azureConfig');
var cosmosDbConfig = require('../../config/cosmosDbConfig');

exports.ensureDb = function () {
    log.Logger.info('Ensuring Cosmos DB exists...');
    msRestAzure.loginWithServicePrincipalSecret(
        azureConfig.servicePrincipal.appId,
        azureConfig.servicePrincipal.password,
        azureConfig.servicePrincipal.tenant,
        (err, credentials) => {
            log.Logger.debug('Logged in with SP');
            
            resourceClient = new resourceManagementClient(credentials, azureConfig.subscription.id);
            resourceClient.resourceGroups.createOrUpdate(azureConfig.resourceGroup.name, azureConfig.resourceGroup.options)
            .then(resourceGroup => {
                log.Logger.debug('Resource group: %s is ready', resourceGroup.name);
            
                cosmosDbClient = new cosmosDBManagementClient(credentials, azureConfig.subscription.id);
                cosmosDbClient.databaseAccounts.createOrUpdate(azureConfig.resourceGroup.name, cosmosDbConfig.databaseAccount.name, cosmosDbConfig.databaseAccount.options)
                .then(databaseAccount => {
                    log.Logger.debug('Database account: %s is ready', databaseAccount.name);
                    cosmosDbClient.databaseAccounts.listKeys(resourceGroup.name, databaseAccount.name)
                    .then(keys => {
                        log.Logger.debug('Fetched keys');
                        var connectionDetails = {
                            endpoint: 'https://' + databaseAccount.name + '.documents.azure.com',
                            key: keys.primaryMasterKey
                        };
                        //TEMP
                        log.Logger.debug('%s', JSON.stringify(connectionDetails));
                    })
                    .catch(err => {
                        log.Logger.error('** List Connection Strings failed: ', err);
                    });
                })
                .catch(err => {
                    log.Logger.error('** Create Database Account failed: ', err);
                });
            })
            .catch(err => {
                log.Logger.error('** Create Resource Group failed: ', err);
            });
        });
  };