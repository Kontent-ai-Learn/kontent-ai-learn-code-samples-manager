const { CODE_SAMPLE_INFO_TABLE } = require('../../utils/constants');
const azure = require('azure-storage');

function getAzureTableService(azureConnectionString) {
    return azure.createTableService(azureConnectionString);
}

function setupAzureTableService(tableService) {
    return new Promise((resolve, reject) => createTableIfNotExists(resolve, reject, tableService));
}

function createTableIfNotExists(resolve, reject, tableService) {
    tableService.createTableIfNotExists(
        CODE_SAMPLE_INFO_TABLE,
        error => handleTableStorageError(resolve, reject, error),
    );
}

function handleTableStorageError(resolve, reject, error) {
    if (error) {
        reject(error);
    }

    resolve();
}

module.exports = {
    setupAzureTableService,
    getAzureTableService,
    handleTableStorageError,
};
