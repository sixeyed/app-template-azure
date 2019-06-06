var cosmosDbConfig = module.exports = {};

cosmosDbConfig.databaseAccount = {
    name: 'cosmos-app-test-123',
    options: {
        location: 'westeurope',
        databaseAccountOfferType: 'standard'
    }
};
