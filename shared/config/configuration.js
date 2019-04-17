const {
    getAzureTableService,
    setupAzureTableService
} = require('../Services/Clients/TableServiceProvider');

const configuration = {
    kenticoProjectId: '',
    kenticoContentManagementApiKey: '',
    azureStorageAccount: '',
    azureStorageAccessKey: '',
    copywritingStepId: '',
    publishedStepId: '',
    archivedStepId: '',
    chunkSize: '',
};

const getEnvironmentVariable = (variableName) =>
    process.env[variableName];

function setupOrchestrator() {
    configuration.chunkSize = getEnvironmentVariable('ChunkSize');
}

function setupKenticoCloud() {
    configuration.kenticoProjectId = getEnvironmentVariable('KC.ProjectId');
    configuration.kenticoContentManagementApiKey = getEnvironmentVariable('KC.ContentManagementApiKey');
    configuration.copywritingStepId = getEnvironmentVariable('KC.Step.CopywritingId');
    configuration.publishedStepId = getEnvironmentVariable('KC.Step.PublishedId');
    configuration.archivedStepId = getEnvironmentVariable('KC.Step.ArchivedId');
}

async function setupAzureStorage() {
    configuration.azureConnectionString = getEnvironmentVariable('Azure.ConnectionString');

    const tableService = getAzureTableService(configuration.azureConnectionString);
    await setupAzureTableService(tableService);
}

module.exports = {
    setupKenticoCloud,
    setupAzureStorage,
    setupOrchestrator,
    configuration,
};
