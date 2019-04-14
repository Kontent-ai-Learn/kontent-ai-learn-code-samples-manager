const azure = require('azure-storage');
const { configuration } = require('../../config/configuration');
const { CODE_SAMPLE_INFO_TABLE } = require('../../utils/constants');

async function getAzureTableService() {
    const tableService = azure.createTableService(
        configuration.azureStorageAccount,
        configuration.azureStorageAccessKey,
    );

    await createTable(tableService);

    return tableService;
}

function createTable(tableService) {
    return new Promise((resolve, reject) => createTableIfNotExists(resolve, reject, tableService));
}

function createTableIfNotExists(resolve, reject, tableService) {
    tableService.createTableIfNotExists(
        CODE_SAMPLE_INFO_TABLE,
        error => handleTableStorageError(resolve, reject, error),
    );
}

async function deleteCodeSampleInfoAsync(resolve, reject, codeSampleInfo) {
    const tableService = await getAzureTableService();

    tableService.deleteEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
        error => handleTableStorageError(resolve, reject, error),
    );
}

async function queryCodeSampleInfoAsync(resolve, reject, query) {
    const tableService = await getAzureTableService();

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
    const tableService = await getAzureTableService();

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
};
