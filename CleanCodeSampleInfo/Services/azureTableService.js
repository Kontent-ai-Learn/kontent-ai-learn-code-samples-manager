const azure = require('azure-storage');
const {
    deleteCodeSampleInfo,
    queryCodeSampleInfo,
} = require('../../shared/Services/Clients/TableServiceClient');

async function deleteAllEntities() {
    const entities = await getAllEntities();

    for (const entity of entities) {
        await deleteEntity(entity.RowKey, entity.PartitionKey);
    }
}

function getAllEntities() {
    return new Promise((resolve, reject) => queryCodeSampleInfo(resolve, reject, new azure.TableQuery()));
}

function deleteEntity(rowKey, partitionKey) {
    return new Promise((resolve, reject) => {
        const info = {
            PartitionKey: partitionKey,
            RowKey: rowKey,
        };

        deleteCodeSampleInfo(resolve, reject, info);
    });
}

module.exports = {
    deleteAllEntities,
};
