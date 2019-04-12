const configVariables = {
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

function setupConfiguration() {
    setupKenticoCloud();
    setupAzureStorage();
    setupWorkflowStepsIds();

    configVariables.chunkSize = getEnvironmentVariable('CHUNK_SIZE');
}

function setupKenticoCloud() {
    configVariables.kenticoProjectId = getEnvironmentVariable('KENTICO_PROJECT_ID');
    configVariables.kenticoContentManagementApiKey = getEnvironmentVariable('KENTICO_CM_API_KEY');
}

function setupAzureStorage() {
    configVariables.azureStorageAccount = getEnvironmentVariable('AZURE_STORAGE_ACCOUNT');
    configVariables.azureStorageAccessKey = getEnvironmentVariable('AZURE_STORAGE_ACCESS_KEY');
}

function setupWorkflowStepsIds() {
    configVariables.copywritingStepId = getEnvironmentVariable('COPYWRITING_STEP_ID');
    configVariables.publishedStepId = getEnvironmentVariable('PUBLISHED_STEP_ID');
    configVariables.archivedStepId = getEnvironmentVariable('ARCHIVED_STEP_ID');
}

module.exports = {
    setupConfiguration,
    configVariables,
};
