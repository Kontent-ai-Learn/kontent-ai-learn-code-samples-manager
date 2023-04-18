const Configuration = require("../shared/external/configuration");
const { manageCodeSamplesAsync } = require("./utils/codeSamplesHandlers");
const {
  manageCodeSampleInfoAsync,
} = require("./utils/codeSamplesInfoServices");
const StackTrace = require("stacktrace-js");

module.exports = async function (context) {
  context.log(`Starting`);

  try {
    await Configuration.setupAzureStorage();
    Configuration.setupKenticoKontent();

    context.log(`Azure storage inicialized`);

    const codeSamplesList = context.bindingData.codeSamplesList;

    if (codeSamplesList.length !== 0) {
      const codeSamplesItemCodename = codeSamplesList[0].identifier;

      context.log(`Processing code sample '${codeSamplesItemCodename}'`);

      context.log(`Processing code sample info`);
      await manageCodeSampleInfoAsync(codeSamplesList);

      context.log(`Processing code samples`);
      await manageCodeSamplesAsync(codeSamplesItemCodename);

      context.log(`Finished`);
    }
  } catch (error) {
    let validationError = "";

    context.log("ERROR: ", error);
    if (error.validationErrors) {
      validationError = error.validationErrors.map((m) => m).join(", ");
    }

    const stacktrace = (await StackTrace.fromError(error))
      .map((sf) => {
        return sf.toString();
      })
      .join("\n");

    /** This try-catch is required for correct logging of exceptions in Azure */
    throw `message: ${error.message},
            validationErrors: ${validationError},
            stack: ${error.stack} ${stacktrace},
            codename: ${codeSamplesItemCodename}`;
  }
};
