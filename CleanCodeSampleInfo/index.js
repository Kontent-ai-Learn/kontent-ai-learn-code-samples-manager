const { setupAzureStorage } = require('../shared/external/configuration');
const { deleteAllEntities } = require('./Services/azureTableService');

module.exports = async function () {
    await setupAzureStorage();
    await deleteAllEntities();
};
