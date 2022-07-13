const Configuration = require("../shared/external/configuration");
const { deleteAllEntities } = require("./Services/azureTableService");
const StackTrace = require("stacktrace-js");

module.exports = async function () {
  try {
    await Configuration.setupAzureStorage();
    await deleteAllEntities();
  } catch (error) {
    /** This try-catch is required for correct logging of exceptions in Azure */

    const stacktrace = (await StackTrace.fromError(error))
      .map((sf) => {
        return sf.toString();
      })
      .join("\n");

    throw `message: ${error.message},
                stack: ${error.stack} ${stacktrace},
                codename: ${codeFragment.codename}`;
  }
};
