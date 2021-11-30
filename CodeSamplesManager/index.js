const Configuration = require('../shared/external/configuration');
const { manageCodeSamplesAsync } = require('./utils/codeSamplesHandlers');
const { manageCodeSampleInfoAsync } = require('./utils/codeSamplesInfoServices');

module.exports = async function (context) {
    context.log(`Starting`);

    await Configuration.setupAzureStorage();
    Configuration.setupKenticoKontent();

    context.log(`Azure storage inicialized`);

    const codeSamplesList = context.bindingData.codeSamplesList;

    if (codeSamplesList.length !== 0) {
        const codeSamplesItemCodename = codeSamplesList[0].identifier;

        context.log(`Processing code sample '${codeSamplesItemCodename}'`);

        try {
            context.log(`Processing code sample info`);
            await manageCodeSampleInfoAsync(codeSamplesList);

            context.log(`Processing code samples`);
            await manageCodeSamplesAsync(codeSamplesItemCodename);

            context.log(`Finished`);
        } catch (error) {
            /** This try-catch is required for correct logging of exceptions in Azure */
            throw `message: ${error.message},
                stack: ${error.stack},
                codename: ${codeSamplesItemCodename}`;
        }
    }
};
