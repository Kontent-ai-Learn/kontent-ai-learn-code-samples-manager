const Configuration = require("../shared/external/configuration");
const { deleteAllEntities } = require("./Services/azureTableService");
const StackTrace = require('stacktrace-js');

module.exports = async function () {
  try {
    await Configuration.setupAzureStorage();
    await deleteAllEntities();
  } catch (error) {
    /** This try-catch is required for correct logging of exceptions in Azure */
    throw `message: ${error.message},
                stack: ${error.stack} ${StackTrace.getSync()},
                codename: ${codeFragment.codename}`;
  }
};
