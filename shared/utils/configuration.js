const keys = {
    kenticoProjectId: '',
    kenticoContentManagmentApiKey: ''
}

const getEnvironmentVariable = (variableName, isTest) =>
    process.env[`${variableName}${isTest ? '.Test' : ''}`];

function setupConfiguration(test) {
    const isTest = test === 'enabled';

    keys.kenticoProjectId = getEnvironmentVariable('KC.ProjectId', isTest);
    keys.kenticoContentManagmentApiKey = getEnvironmentVariable('KC.ContentManagmentApiKey', isTest);
}

module.exports = {
    setupConfiguration,
    keys
};   