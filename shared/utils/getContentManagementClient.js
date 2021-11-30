const Configuration = require('../external/configuration');
const { ManagementClient } = require('@kentico/kontent-management');

function getContentManagementClient() {
    return new ManagementClient({
        projectId: Configuration.kenticoProjectId,
        apiKey: Configuration.kenticoContentManagementApiKey,
        retryStrategy: {
            addJitter: true,
            canRetryError: () => true, // retry all errors
            maxAttempts: 1,
            deltaBackoffMs: 1000,
            maxCumulativeWaitTimeMs: 10000 
        }
    });
}

module.exports = {
    getContentManagementClient
};
