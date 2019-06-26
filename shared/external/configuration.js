const {
    getAzureTableService,
    setupAzureTableService,
} = require('../Services/Clients/TableServiceProvider');

class Configuration {
    static setupOrchestrator() {
        Configuration.chunkSize = getEnvironmentVariable('ChunkSize');
        Configuration.notifierEndpoint = getEnvironmentVariable('Notifier.Endpoint');
    }

    static setupKenticoCloud() {
        Configuration.kenticoProjectId = getEnvironmentVariable('KC.ProjectId');
        Configuration.kenticoContentManagementApiKey = getEnvironmentVariable('KC.ContentManagementApiKey');
        Configuration.copywritingStepId = getEnvironmentVariable('KC.Step.CopywritingId');
        Configuration.publishedStepId = getEnvironmentVariable('KC.Step.PublishedId');
        Configuration.archivedStepId = getEnvironmentVariable('KC.Step.ArchivedId');
    }

    static async setupAzureStorage() {
        Configuration.azureConnectionString = getEnvironmentVariable('Azure.ConnectionString');

        const tableService = getAzureTableService(Configuration.azureConnectionString);
        await setupAzureTableService(tableService);
    }
}

const getEnvironmentVariable = (variableName) =>
    process.env[variableName] || '';

module.exports = Configuration;
