const { configuration } = require('../external/configuration');
const { ContentManagementClient } = require('kentico-cloud-content-management');

function getContentManagementClient() {
    return new ContentManagementClient({
        projectId: configuration.kenticoProjectId,
        apiKey: configuration.kenticoContentManagementApiKey,
    });
}

module.exports = {
    getContentManagementClient
};