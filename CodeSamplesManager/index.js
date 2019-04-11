const { setupConfiguration } = require('../shared/utils/configuration');
const {
    updateCodeSamplesCodenamesTable,
    updateCodeSamplesContentItemInKenticoCloud,
} = require('./utils/codeSamplesHandlers');

module.exports = async function (context) {
    setupConfiguration();

    const codeSamplesList = context.bindingData.codeSamplesList;
    const codeSample = codeSamplesList[0];

    await updateCodeSamplesCodenamesTable(codeSamplesList);
    await updateCodeSamplesContentItemInKenticoCloud(codeSample);
};
