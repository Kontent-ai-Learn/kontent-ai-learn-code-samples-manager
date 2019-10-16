const Configuration = require('../shared/external/configuration');
const { manageCodeSamplesAsync } = require('./utils/codeSamplesHandlers');
const { manageCodeSampleInfoAsync } = require('./utils/codeSamplesInfoServices');

module.exports = async function (context) {
    await Configuration.setupAzureStorage();
    Configuration.setupKenticoKontent();

    const codeSamplesList = context.bindingData.codeSamplesList;

    if (codeSamplesList.length !== 0) {
        const codeSamplesItemCodename = codeSamplesList[0].identifier;

        try {
            await manageCodeSampleInfoAsync(codeSamplesList);
            await manageCodeSamplesAsync(codeSamplesItemCodename);
        } catch (error) {
            /** This try-catch is required for correct logging of exceptions in Azure */
            throw `message: ${error.message},
                stack: ${error.stack},
                codename: ${codeSamplesItemCodename}`;
        }
    }
};
