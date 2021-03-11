const azure = require('azure-storage');
const tableServiceClient = require('../../shared/Services/Clients/TableServiceClient');
const {
    ACTIVE_CODE_SAMPLE_INFO,
    ARCHIVED_CODE_SAMPLE_INFO,
} = require('../../shared/utils/constants');

function upsertCodeSampleInfoPromise(codename, identifier) {
    const codeSampleInfo = prepareCodeSampleInfo(
        identifier,
        codename,
        ACTIVE_CODE_SAMPLE_INFO,
    );

    return executeCodeSampleInfoModificationPromise(
        codeSampleInfo,
        tableServiceClient.upsertCodeSampleInfoPromise,
    );
}

function archiveCodeSampleInfoPromise(codename, identifier) {
    const codeSampleInfo = prepareCodeSampleInfo(
        identifier,
        codename,
        ARCHIVED_CODE_SAMPLE_INFO,
    );

    return executeCodeSampleInfoModificationPromise(
        codeSampleInfo,
        tableServiceClient.upsertCodeSampleInfoPromise,
    )
}

function getCodeSampleInfoPromise(identifier) {
    return new Promise((resolve, reject) => {
        const query = new azure
            .TableQuery()
            .where('PartitionKey eq ?', identifier);

        tableServiceClient.queryCodeSampleInfo(resolve, reject, query);
    });
}

function executeCodeSampleInfoModificationPromise(codeSampleInfo, modificationFunction) {
    return new Promise((resolve, reject) => {
        modificationFunction(resolve, reject, codeSampleInfo);
    });
}

function prepareCodeSampleInfo(identifier, codename, status) {
    return {
        PartitionKey: { _: identifier },
        RowKey: { _: codename },
        Status: { _: status },
    };
}

module.exports = {
    upsertCodeSampleInfoPromise,
    archiveCodeSampleInfoPromise,
    getCodeSampleInfoPromise,
};
