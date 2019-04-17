const {
    getAzureTableService,
    handleTableStorageError,
} = require('./TableServiceProvider');
const { configuration } = require('./../../config/configuration');
const { CODE_SAMPLE_INFO_TABLE } = require('../../utils/constants');

async function deleteCodeSampleInfoAsync(resolve, reject, codeSampleInfo) {
    const tableService = getAzureTableService(configuration.azureConnectionString);

    tableService.deleteEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
        error => handleTableStorageError(resolve, reject, error),
    );
}

async function queryCodeSampleInfoAsync(resolve, reject, query) {
    const tableService = getAzureTableService(configuration.azureConnectionString);

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
    const tableService = getAzureTableService(configuration.azureConnectionString);

    tableService.insertOrReplaceEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
        error => handleTableStorageError(resolve, reject, error),
    );
}

module.exports = {
    deleteCodeSampleInfoAsync,
    queryCodeSampleInfoAsync,
    upsertCodeSampleInfoAsync,
};
