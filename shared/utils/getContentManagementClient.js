const { configuration } = require('../external/configuration');
const { ContentManagementClient } = require('kentico-cloud-content-management');

function getContentManagementClient() {
    return new ContentManagementClient({
        projectId: configuration.kenticoProjectId,
        apiKey: configuration.kenticoContentManagementApiKey,
        /* Ensures we don't hit the requests per minute API limit */
        retryAttempts: 9,
        /* To ensure we retry correct refused requests. */
        retryStatusCodes: [408, 429, 500, 502, 503, 504],
    });
}

module.exports = {
    getContentManagementClient
};
