const { configVariables } = require('../config/configuration');
const { ContentManagementClient } = require('kentico-cloud-content-management');

function getContentManagementClient() {
    return new ContentManagementClient({
        projectId: configVariables.kenticoProjectId,
        apiKey: configVariables.kenticoContentManagementApiKey,
    });
}

module.exports = getContentManagementClient;
