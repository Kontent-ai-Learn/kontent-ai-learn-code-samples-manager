const azure = require('azure-storage');
const { keys } = require('../../shared/utils/configuration');
const { CODE_SAMPLES_CODENAMES_TABLE } = require('../../shared/utils/constants');
const { getCodeSamplesCodename } = require('./processCodename')

function createTable(tableService) {
    return new Promise((resolve, reject) => {
        try {
            tableService
                .createTableIfNotExists(CODE_SAMPLES_CODENAMES_TABLE, (error, result) => {
                    if (error) {
                        throw new Error('Creation of the table in the azure table storage failed!')
                    }

                    resolve(result);
                });
        } catch (error) {
            reject(error);
        }
    });
}

async function getAzureTableService() {
    const tableService = azure.createTableService(keys.azureStorageAccount, keys.azureStorageAccessKey, 'http://127.0.0.1:10002/devstoreaccount1');
    await createTable(tableService);

    return tableService;
}

function addCodenameToTable(codename) {
    const task = {
        PartitionKey: { '_': getCodeSamplesCodename(codename) },
        RowKey: { '_': codename },
    }

    return new Promise(async (resolve, reject) => {
        try {
            const tableService = await getAzureTableService();

            tableService
                .insertOrReplaceEntity(CODE_SAMPLES_CODENAMES_TABLE, task, function (error, result) {
                    if (error) {
                        throw new Error('Creation of the codeSamples codename in the azure table storage failed!')
                    }

                    resolve(result);
                })
        } catch (error) {
            reject(error);
        }
    });
}

function removeCodenameFromTable(codename) {
    const task = {
        PartitionKey: { '_': getCodeSamplesCodename(codename) },
        RowKey: { '_': codename },
    }

    return new Promise(async (resolve, reject) => {
        try {
            const tableService = await getAzureTableService();

            tableService
                .deleteEntity(CODE_SAMPLES_CODENAMES_TABLE, task, function (error, result) {
                    if (error) {
                        throw new Error('Deletion of the codename' + codename + 'from the azure table storage failed!')
                    }

                    resolve(result);
                });
        } catch (error) {
            reject(error);
        }
    });
}

function getAllCodenamesWithSameBase(codename) {
    const query = new azure
        .TableQuery()
        .where('PartitionKey eq ?', getCodeSamplesCodename(codename));

    return new Promise(async (resolve, reject) => {
        try {
            const tableService = await getAzureTableService();

            tableService
                .queryEntities(CODE_SAMPLES_CODENAMES_TABLE, query, null, function(error, result) {
                    if (error) {
                        throw new Error('Retrieving codeSamples with the same codename base failed!');
                    }

                    const codenames = result.entries.map(entry => entry.RowKey['_']);
                    resolve(codenames);
                })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    addCodenameToTable,
    removeCodenameFromTable,
    getAllCodenamesWithSameBase
};
