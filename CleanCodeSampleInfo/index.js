const Configuration = require('../shared/external/configuration');
const { deleteAllEntities } = require('./Services/azureTableService');

module.exports = async function () {
    await Configuration.setupAzureStorage();
    await deleteAllEntities();
};
