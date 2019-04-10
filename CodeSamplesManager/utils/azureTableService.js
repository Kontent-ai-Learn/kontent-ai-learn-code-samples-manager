const azure = require('azure-storage');
const {
    upsertCodenameEntity,
    deleteCodenameEntity,
    queryCodenamesEntities
} = require('../../shared/Services/Clients/TableServiceClient');

function addCodenameToTable(codename, identifier) {
    return new Promise(async (resolve, reject) => {
        const task = prepareCodenameEntity(identifier, codename);

        await upsertCodenameEntity(resolve, reject, task);
    });
}

function removeCodenameFromTable(codename, identifier) {
    return new Promise(async (resolve, reject) => {
        const task = prepareCodenameEntity(identifier, codename);

        await deleteCodenameEntity(resolve, reject, task);
    });
}

async function getCodenamesByIdentifier(identifier) {
    const codenamesEntities = await getCodenamesEntities(identifier);

    return codenamesEntities.map(entity => entity.RowKey['_']);
}

function getCodenamesEntities(identifier) {
    return new Promise(async (resolve, reject) => {
        const query = new azure
            .TableQuery()
            .where('PartitionKey eq ?', identifier);

        await queryCodenamesEntities(resolve, reject, query);
    });
}

function prepareCodenameEntity(identifier, codename) {
    return {
        PartitionKey: { '_': identifier },
        RowKey: { '_': codename },
    };
}

module.exports = {
    addCodenameToTable,
    removeCodenameFromTable,
    getCodenamesByIdentifier
};
