const azure = require('azure-storage');
const tableServiceClient = require('../../shared/Services/Clients/TableServiceClient');
const {
    ACTIVE_CODE_SAMPLE_INFO,
    ARCHIVED_CODE_SAMPLE_INFO,
} = require('../../shared/utils/constants');

function upsertCodeSampleInfoAsync(codename, identifier) {
    const codeSampleInfo = prepareCodeSampleInfo(
        identifier,
        codename,
        ACTIVE_CODE_SAMPLE_INFO,
    );

    return executeCodeSampleInfoModification(
        codeSampleInfo,
        tableServiceClient.upsertCodeSampleInfoAsync,
    );
}

function archiveCodeSampleInfoAsync(codename, identifier) {
    const codeSampleInfo = prepareCodeSampleInfo(
        identifier,
        codename,
        ARCHIVED_CODE_SAMPLE_INFO,
    );

    return executeCodeSampleInfoModification(
        codeSampleInfo,
        tableServiceClient.upsertCodeSampleInfoAsync,
    )
}

function getCodeSampleInfoAsync(identifier) {
    return executeQueryCodeSampleInfo(identifier);
}

function executeCodeSampleInfoModification(codeSampleInfo, modificationFunction) {
    return new Promise(async (resolve, reject) => {
        await modificationFunction(resolve, reject, codeSampleInfo);
    });
}

function executeQueryCodeSampleInfo(identifier) {
    return new Promise(async (resolve, reject) => {
        const query = new azure
            .TableQuery()
            .where('PartitionKey eq ?', identifier);

        await tableServiceClient.queryCodeSampleInfoAsync(resolve, reject, query);
    });
}

function prepareCodeSampleInfo(identifier, codename, status) {
    return {
        PartitionKey: { '_': identifier },
        RowKey: { '_': codename },
        Status: { '_': status },
    };
}

module.exports = {
    upsertCodeSampleInfoAsync,
    archiveCodeSampleInfoAsync,
    getCodeSampleInfoAsync,
};
