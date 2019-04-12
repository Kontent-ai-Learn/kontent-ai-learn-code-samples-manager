const {
    updateCodeSampleInfoAsync,
    updateCodeSamplesItemAsync,
} = require('./utils/codeSamplesHandlers');

module.exports = async function (context) {
    const codeSamplesList = context.bindingData.codeSamplesList;
    const codeSample = codeSamplesList[0];

    await updateCodeSampleInfoAsync(codeSamplesList);
    await updateCodeSamplesItemAsync(codeSample);
};
