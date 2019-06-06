const msRestAzure = require('ms-rest-azure');
const resourceManagementClient = require('azure-arm-resource').ResourceManagementClient;
const cosmosDBManagementClient = require('azure-arm-cosmosdb').CosmosDBManagementClient;

var log = require('./log');
var azureConfig = require('./config/azureConfig');

var fs = require('fs')

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
                cosmosDbClient.databaseAccounts.createOrUpdate(azureConfig.resourceGroup.name, azureConfig.databaseAccount.name, azureConfig.databaseAccount.options)
                .then(databaseAccount => {
                    log.Logger.debug('Database account: %s is ready', databaseAccount.name);
                    cosmosDbClient.databaseAccounts.listKeys(resourceGroup.name, databaseAccount.name)
                    .then(keys => {
                        log.Logger.debug('Fetched keys');

                        var cosmosDbConfig = {
                            connection: {
                                endpoint: 'https://' + databaseAccount.name + '.documents.azure.com',
                                key: keys.primaryMasterKey
                            }
                        };

                        var templatePath = './templates/cosmosDbConfig.js';
                        var data = fs.readFileSync(templatePath, 'utf8');
                        var result = data.replace('%ENDPOINT%', 'https://' + databaseAccount.name + '.documents.azure.com')
                                         .replace('%KEY%', keys.primaryMasterKey);                        
                        
                        var targetPath = '/project/cosmosDbConfig.js';
                        fs.writeFileSync(targetPath, result, 'utf8');
                        log.Logger.debug('Wrote connection details to: %s', targetPath);
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