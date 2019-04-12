const azure = require('azure-storage');
const {
    deleteCodenameEntity,
    queryCodenamesEntities,
} = require('../../shared/Services/Clients/TableServiceClient');

async function deleteAllEntities() {
    const entities = await getAllEntities();

    for (const entity of entities) {
        await removeCodenameFromTable(entity.RowKey, entity.PartitionKey);
    }
}

function getAllEntities() {
    return new Promise((resolve, reject) => queryCodenamesEntities(resolve, reject, new azure.TableQuery()));
}

function removeCodenameFromTable(rowKey, partitionKey) {
    return new Promise(async (resolve, reject) => {
        const task = {
            PartitionKey: partitionKey,
            RowKey: rowKey,
        };

        await deleteCodenameEntity(resolve, reject, task);
    });
}

module.exports = {
    deleteAllEntities,
};
