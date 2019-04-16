const {
    setupAzureStorage,
    setupKenticoCloud,
} = require('../shared/config/configuration');
const {
    updateCodeSampleInfoAsync,
    updateCodeSamplesItemAsync,
} = require('./utils/codeSamplesHandlers');

module.exports = async function (context) {
    setupAzureStorage();
    setupKenticoCloud();

    const codeSamplesList = context.bindingData.codeSamplesList;

    if (codeSamplesList.length !== 0) {
        const codeSamplesItemCodename = codeSamplesList[0].identifier;

        await updateCodeSampleInfoAsync(codeSamplesList);
        await updateCodeSamplesItemAsync(codeSamplesItemCodename);
    }
};
