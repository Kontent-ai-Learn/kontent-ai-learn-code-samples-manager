const keys = {
    kenticoProjectId: '',
    kenticoContentManagmentApiKey: '',
    azureStorageAccount: '',
    azureStorageAccessKey: '',
    draftStepId: '',
    publishedStepId: '',
    archivedStepId: '',
};

const getEnvironmentVariable = (variableName, isTest) =>
    process.env[`${variableName}${isTest ? '.Test' : ''}`];

function setupConfiguration(test) {
    const isTest = test === 'enabled';

    setupKenticoCloud(isTest);
    setupAzureStorage(isTest);
    setupWorkflowStepsIds(isTest);
}

function setupKenticoCloud(isTest) {
    keys.kenticoProjectId = getEnvironmentVariable('KC.ProjectId', isTest);
    keys.kenticoContentManagmentApiKey = getEnvironmentVariable('KC.ContentManagmentApiKey', isTest);
}

function setupAzureStorage(isTest) {
    keys.azureStorageAccount = getEnvironmentVariable('AZURE_STORAGE_ACCOUNT', isTest);
    keys.azureStorageAccessKey = getEnvironmentVariable('AZURE_STORAGE_ACCESS_KEY', isTest);
    keys.azureStorageEndpoint = getEnvironmentVariable('AZURE_STORAGE_ENDPOINT', isTest);
}

function setupWorkflowStepsIds(isTest) {
    keys.draftStepId = getEnvironmentVariable('DRAFT_STEP_ID', isTest);
    keys.publishedStepId = getEnvironmentVariable('PUBLISHED_STEP_ID', isTest);
    keys.archivedStepId = getEnvironmentVariable('ARCHIVE_STEP_ID', isTest);
}

module.exports = {
    setupConfiguration,
    keys,
};
