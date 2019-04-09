const azure = require('azure-storage');
const { keys } = require('../../shared/utils/configuration');
const { CODE_SAMPLES_CODENAMES_TABLE } = require('../../shared/utils/constants');

function createTable(tableService) {
    return new Promise((resolve, reject) => createTableIfNotExists(resolve, reject, tableService));
}

function createTableIfNotExists(resolve, reject, tableService) {
    tableService.createTableIfNotExists(
        CODE_SAMPLES_CODENAMES_TABLE,
        error => handleTableStorageError(resolve, reject, error)
    );
}

async function getAzureTableService() {
    const tableService = azure.createTableService(
        keys.azureStorageAccount,
        keys.azureStorageAccessKey,
        keys.azureStorageEndpoint
    );

    await createTable(tableService);

    return tableService;
}

function addCodenameToTable(codename, identifier) {
    return new Promise(async (resolve, reject) => {
        const task = {
            PartitionKey: { '_': identifier },
            RowKey: { '_': codename },
        }

        upsertCodenameEntity(resolve, reject, task);
    });
}

async function upsertCodenameEntity(resolve, reject, task) {
    const tableService = await getAzureTableService();

    tableService.insertOrReplaceEntity(
        CODE_SAMPLES_CODENAMES_TABLE,
        task,
        error => handleTableStorageError(resolve, reject, error)
    );
}

function removeCodenameFromTable(codename, identifier) {
    return new Promise((resolve, reject) => {
        const task = {
            PartitionKey: { '_': identifier },
            RowKey: { '_': codename },
        }

        deleteCodenameEntity(resolve, reject, task);
    });
}

async function deleteCodenameEntity(resolve, reject, task) {
    const tableService = await getAzureTableService();

    tableService.deleteEntity(
        CODE_SAMPLES_CODENAMES_TABLE,
        task,
        error => handleTableStorageError(resolve, reject, error)
    );
}

function handleTableStorageError(resolve, reject, error) {
    if (error) {
        reject(error);
    }

    resolve();
}

function getCodenamesByIdentifier(identifier) {
    return new Promise((resolve, reject) => {
        const query = new azure
            .TableQuery()
            .where('PartitionKey eq ?', identifier);

        queryCodenamesEntities(resolve, reject, query);
    });
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

            const codenames = result.entries.map(entry => entry.RowKey['_']);
            resolve(codenames);
        }
    );
}

module.exports = {
    addCodenameToTable,
    removeCodenameFromTable,
    getCodenamesByIdentifier
};
