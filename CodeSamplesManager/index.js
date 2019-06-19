const {
    setupAzureStorage,
    setupKenticoCloud,
} = require('../shared/external/configuration');
const { manageCodeSamplesAsync } = require('./utils/codeSamplesHandlers');
const { manageCodeSampleInfoAsync } = require('./utils/codeSamplesInfoServices');

module.exports = async function (context) {
    setupAzureStorage();
    setupKenticoCloud();

    const codeSamplesList = context.bindingData.codeSamplesList;

    if (codeSamplesList.length !== 0) {
        const codeSamplesItemCodename = codeSamplesList[0].identifier;

        try {
            await manageCodeSampleInfoAsync(codeSamplesList);
            await manageCodeSamplesAsync(codeSamplesItemCodename);
        } catch (error) {
            throw {
                message: error.message,
                stack: error.stack,
                codename: codeSamplesItemCodename,
            };
        }
    }
};
