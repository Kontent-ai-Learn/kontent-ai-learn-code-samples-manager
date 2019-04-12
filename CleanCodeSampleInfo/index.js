const { deleteAllEntities } = require('./Services/azureTableService');

module.exports = async function () {
    await deleteAllEntities();
};
