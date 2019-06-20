const CosmosClient = require("@azure/cosmos").CosmosClient;

module.exports = async function (context, req) {
    context.log('HTTP trigger fired');

    var cosmosEndpoint = process.env["cosmosEndpoint"]
    var cosmosKey = process.env["cosmosKey"]
    var cosmosDatabase = process.env["cosmosDatabase"]
    var cosmosContainer = process.env["cosmosContainer"]

    const client = new CosmosClient({
        endpoint: cosmosEndpoint,
        auth: {
            masterKey: cosmosKey
        }
    });
    const database = client.database(cosmosDatabase);
    const container = database.container(cosmosContainer);
    context.log('Connected to CosmosDB');

    const querySpec = {
        query: "SELECT COUNT(1) as Total FROM Events"
    };

    const { result: results } = await container.items
        .query(querySpec)
        .toArray();

    context.res = {
        status: 200,
        body: results[0].Total
    };
};