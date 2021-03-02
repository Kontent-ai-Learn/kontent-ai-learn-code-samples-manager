const {
    getAzureTableService,
    handleTableStorageError,
} = require('./TableServiceProvider');
const Configuration = require('./../../external/configuration');
const { CODE_SAMPLE_INFO_TABLE } = require('../../utils/constants');

function deleteCodeSampleInfo(resolve, reject, codeSampleInfo) {
    const tableService = getAzureTableService(Configuration.azureConnectionString);

    tableService.deleteEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
        error => handleTableStorageError(resolve, reject, error),
    );
}

function queryCodeSampleInfo(resolve, reject, query) {
    const tableService = getAzureTableService(Configuration.azureConnectionString);

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

function upsertCodeSampleInfoPromise(resolve, reject, codeSampleInfo) {
    const tableService = getAzureTableService(Configuration.azureConnectionString);

    tableService.insertOrReplaceEntity(
        CODE_SAMPLE_INFO_TABLE,
        codeSampleInfo,
        error => handleTableStorageError(resolve, reject, error),
    );
}

module.exports = {
    deleteCodeSampleInfo,
    queryCodeSampleInfo,
    upsertCodeSampleInfoPromise,
};
