const {
    updateCodeSampleInfoAsync,
    updateCodeSamplesItemAsync,
} = require('./utils/codeSamplesHandlers');

module.exports = async function (context) {
    const codeSamplesList = context.bindingData.codeSamplesList;

    if (codeSamplesList.length !== 0) {
        const codeSamplesItemCodename = codeSamplesList[0].identifier;

        await updateCodeSampleInfoAsync(codeSamplesList);
        await updateCodeSamplesItemAsync(codeSamplesItemCodename);
    }
};
