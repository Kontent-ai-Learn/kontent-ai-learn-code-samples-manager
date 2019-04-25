const {
    setupAzureStorage,
    setupKenticoCloud,
} = require('../shared/external/configuration');
const {
    updateCodeSampleInfoAsync,
    updateCodeSamplesItemAsync,
} = require('./utils/codeSamplesHandlers');

module.exports = async function (context) {
    try {
        setupAzureStorage();
        setupKenticoCloud();

        const codeSamplesList = context.bindingData.codeSamplesList;

        if (codeSamplesList.length !== 0) {
            const codeSamplesItemCodename = codeSamplesList[0].identifier;

            await updateCodeSampleInfoAsync(codeSamplesList);
            await updateCodeSamplesItemAsync(codeSamplesItemCodename);
        }
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
