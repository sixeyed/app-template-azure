const CosmosClient = require("@azure/cosmos").CosmosClient;
var dbConfig = require('../../config/dbConfig');
var cosmosDbConfig = require('../../config/cosmosDbConfig');
var log = require('../../log');

class EventData {

    constructor() {    
        this.database = null;
        this.container = null;
      }

    async init() {
        log.Logger.debug('Connecting to CosmosDB: %s', cosmosDbConfig.connection.endpoint);
        const client = new CosmosClient({
            endpoint: cosmosDbConfig.connection.endpoint,
            auth: {
                masterKey: cosmosDbConfig.connection.key
            }
        });

        const dbResponse = await client.databases.createIfNotExists({
            id: dbConfig.database.id
        });
        this.database = dbResponse.database
        log.Logger.debug('Database: %s is ready', this.database.id);
        
        const coResponse = await this.database.containers.createIfNotExists({
            id: dbConfig.database.containerId
        });
        this.container = coResponse.container;
        log.Logger.debug('Container: %s is ready', this.container.id);

        await this.seed();
    }

    async seed() {
        const querySpec = {
            query: "SELECT COUNT(1) as Total FROM Events"
          };

        const { result : results } = await this.container.items
          .query(querySpec)
          .toArray();
        
        if (results[0].Total == 0) {
            log.Logger.debug('Seeding default data...');
            var event = {
                id: 'dcus20',
                title: 'DockerCon',
                detail: 'The #1 container conference for the industry',
                date: '2020-06-15'
            }
            await this.container.items.create(event);
            event = {
                id: 'pslive19',
                title: 'Pluralsight Live',
                detail: 'The ultimate tech skills conference',
                date: '2019-08-27'
            }
            await this.container.items.create(event);
            log.Logger.debug('Data seeded');
        }
        else {
            log.Logger.debug('Data exists, not seeding');
        }
    }    

    async findAll() {
        this.ensureConnection();

        const querySpec = {
            query: "SELECT * FROM Events"
          };

        const { result : results } = await this.container.items
          .query(querySpec)
          .toArray();

        log.Logger.debug('findAll() returning: %n events', JSON.stringify(results.length));
        
        return results;
    }

    async create(event) {
        this.ensureConnection();
        event.id = this.generateId();
        await this.container.items.create(event);
        log.Logger.debug('Created event with id: %s', event.id);
        return event.id;
    }

    async delete(eventId) {
        this.ensureConnection();
        await this.container.item(eventId).delete();
        log.Logger.debug('Deleted event with id: %s', eventId);
    }

    generateId() {
        return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
        });
    }

    ensureConnection() {
        if (this.container == null) {
            const client = new CosmosClient({
                endpoint: cosmosDbConfig.connection.endpoint,
                auth: {
                    masterKey: cosmosDbConfig.connection.key
                }
            });
    
            this.database = client.database(dbConfig.database.id);
            this.container = this.database.container(dbConfig.database.containerId);
        }
    }
}

module.exports = EventData