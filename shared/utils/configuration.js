const keys = {
    kenticoProjectId: '',
    kenticoContentManagmentApiKey: '',
    azureStorageAccount: '',
    azureStorageAccessKey: ''
};

const getEnvironmentVariable = (variableName, isTest) =>
    process.env[`${variableName}${isTest ? '.Test' : ''}`];

function setupConfiguration(test) {
    const isTest = test === 'enabled';

    keys.kenticoProjectId = getEnvironmentVariable('KC.ProjectId', isTest);
    keys.kenticoContentManagmentApiKey = getEnvironmentVariable('KC.ContentManagmentApiKey', isTest);
    keys.azureStorageAccount = getEnvironmentVariable('AZURE_STORAGE_ACCOUNT', isTest);
    keys.azureStorageAccessKey = getEnvironmentVariable('AZURE_STORAGE_ACCESS_KEY', isTest);
}

module.exports = {
    setupConfiguration,
    keys
};
