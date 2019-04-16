const azure = require('azure-storage');
const { configuration } = require('../../config/configuration');
const { CODE_SAMPLE_INFO_TABLE } = require('../../utils/constants');

function getAzureTableService(azureStorageAccount, azureStorageAccessKey) {
    return azure.createTableService(
        azureStorageAccount,
        azureStorageAccessKey,
    );
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

async function deleteCodeSampleInfoAsync(resolve, reject, codeSampleInfo) {
    const tableService = getAzureTableService(configuration.azureStorageAccount, configuration.azureStorageAccessKey);

    tableService.deleteEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
        error => handleTableStorageError(resolve, reject, error),
    );
}

async function queryCodeSampleInfoAsync(resolve, reject, query) {
    const tableService = getAzureTableService(configuration.azureStorageAccount, configuration.azureStorageAccessKey);

    tableService.queryEntities(
        CODE_SAMPLE_INFO_TABLE,
        query,
        null,
        (error, result) => {
            if (error) {
                reject(error);
            }

            resolve(result.entries);
        },
    );
}

async function upsertCodeSampleInfoAsync(resolve, reject, codeSampleInfo) {
    const tableService = getAzureTableService(configuration.azureStorageAccount, configuration.azureStorageAccessKey);

    tableService.insertOrReplaceEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
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
    deleteCodeSampleInfoAsync,
    queryCodeSampleInfoAsync,
    upsertCodeSampleInfoAsync,
    setupAzureTableService,
    getAzureTableService,
};
