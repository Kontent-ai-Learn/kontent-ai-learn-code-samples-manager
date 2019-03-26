const { keys } = require('./configuration');
const { ContentManagementClient } = require('kentico-cloud-content-management');

function getContentManagementClient() {
    return new ContentManagementClient({
        projectId: keys.kenticoProjectId, 
        apiKey: keys.kenticoContentManagmentApiKey
    });
}

module.exports = getContentManagementClient;