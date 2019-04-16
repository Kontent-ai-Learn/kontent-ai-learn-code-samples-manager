const { setupAzureStorage } = require('../shared/config/configuration');
const { deleteAllEntities } = require('./Services/azureTableService');

module.exports = async function () {
    await setupAzureStorage();
    await deleteAllEntities();
};
