const { setupAzureStorage } = require('../shared/external/configuration');
const { deleteAllEntities } = require('./Services/azureTableService');

module.exports = async function () {
    try {
        await setupAzureStorage();
        await deleteAllEntities();
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
