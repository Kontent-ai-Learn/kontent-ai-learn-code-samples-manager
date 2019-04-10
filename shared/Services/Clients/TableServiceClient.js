const azure = require('azure-storage');
const { keys } = require('../../utils/configuration');
const { CODE_SAMPLES_CODENAMES_TABLE } = require('../../utils/constants');

async function getAzureTableService() {
    const tableService = azure.createTableService(
        keys.azureStorageAccount,
        keys.azureStorageAccessKey,
    );

    await createTable(tableService);

    return tableService;
}

function createTable(tableService) {
    return new Promise((resolve, reject) => createTableIfNotExists(resolve, reject, tableService));
}

function createTableIfNotExists(resolve, reject, tableService) {
    tableService.createTableIfNotExists(
        CODE_SAMPLES_CODENAMES_TABLE,
        error => handleTableStorageError(resolve, reject, error),
    );
}

async function deleteCodenameEntity(resolve, reject, task) {
    const tableService = await getAzureTableService();

    tableService.deleteEntity(
        CODE_SAMPLES_CODENAMES_TABLE,
        task,
        error => handleTableStorageError(resolve, reject, error),
    );
}

async function queryCodenamesEntities(resolve, reject, query) {
    const tableService = await getAzureTableService();

    tableService.queryEntities(
        CODE_SAMPLES_CODENAMES_TABLE,
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

async function upsertCodenameEntity(resolve, reject, task) {
    const tableService = await getAzureTableService();

    tableService.insertOrReplaceEntity(
        CODE_SAMPLES_CODENAMES_TABLE,
        task,
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
    deleteCodenameEntity,
    queryCodenamesEntities,
    upsertCodenameEntity,
};
