const azure = require('azure-storage');
const tableServiceClient = require('../../shared/Services/Clients/TableServiceClient');

function upsertCodeSampleInfoAsync(codename, identifier) {
    return executeCodeSampleInfoModification(
        codename,
        identifier,
        tableServiceClient.upsertCodeSampleInfoAsync,
    );
}

function deleteCodeSampleInfoAsync(codename, identifier) {
    return executeCodeSampleInfoModification(
        codename,
        identifier,
        tableServiceClient.deleteCodeSampleInfoAsync,
    )
}

async function queryCodeSampleInfoAsync(identifier) {
    const codeSampleInfoEntities = await executeQueryCodeSampleInfo(identifier);

    return codeSampleInfoEntities.map(entity => entity.RowKey['_']);
}

function executeCodeSampleInfoModification(codename, identifier, modificationFunction) {
    return new Promise(async (resolve, reject) => {
        const codeSampleInfo = prepareCodeSampleInfo(identifier, codename);

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

function prepareCodeSampleInfo(identifier, codename) {
    return {
        PartitionKey: { '_': identifier },
        RowKey: { '_': codename },
    };
}

module.exports = {
    upsertCodeSampleInfoAsync,
    removeCodeSampleInfoAsync: deleteCodeSampleInfoAsync,
    queryCodeSampleInfoAsync,
};
