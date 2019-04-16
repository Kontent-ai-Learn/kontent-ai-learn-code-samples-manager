const {
    getAzureTableService,
    setupAzureTableService
} = require('../Services/Clients/TableServiceClient');

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
    configuration.chunkSize = getEnvironmentVariable('CHUNK_SIZE');
}

function setupKenticoCloud() {
    configuration.kenticoProjectId = getEnvironmentVariable('KENTICO_PROJECT_ID');
    configuration.kenticoContentManagementApiKey = getEnvironmentVariable('KENTICO_CM_API_KEY');
    configuration.copywritingStepId = getEnvironmentVariable('COPYWRITING_STEP_ID');
    configuration.publishedStepId = getEnvironmentVariable('PUBLISHED_STEP_ID');
    configuration.archivedStepId = getEnvironmentVariable('ARCHIVED_STEP_ID');
}

async function setupAzureStorage() {
    configuration.azureStorageAccount = getEnvironmentVariable('AZURE_STORAGE_ACCOUNT');
    configuration.azureStorageAccessKey = getEnvironmentVariable('AZURE_STORAGE_ACCESS_KEY');

    const tableService = getAzureTableService(configuration.azureStorageAccount, configuration.azureStorageAccessKey);
    await setupAzureTableService(tableService);
}

module.exports = {
    setupKenticoCloud,
    setupAzureStorage,
    setupOrchestrator,
    configuration,
};
