const Configuration = require('../external/configuration');
const { ManagementClient } = require('@kentico/kontent-management');

function getContentManagementClient() {
    return new ManagementClient({
        projectId: Configuration.kenticoProjectId,
        apiKey: Configuration.kenticoContentManagementApiKey,
        retryStrategy: {
            addJitter: false,
            canRetryError: () => true, // retry all errors
            maxAttempts: 3,
            deltaBackoffMs: 200,
            maxCumulativeWaitTimeMs: 15000 
        }
    });
}

module.exports = {
    getContentManagementClient
};
