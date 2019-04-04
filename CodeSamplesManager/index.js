const { setupConfiguration } = require('../shared/utils/configuration');
const {
    upsertCodeSamples,
    archiveCodeSamples
} = require('./utils/codeSamplesHandlers');

module.exports = async function (context) {
    setupConfiguration();

    const codeSamplesList = context.bindingData.codeSamplesList;

    for (const codeSample of codeSamplesList) {
        switch (codeSample.status) {
            case 'added':
            case 'modified':
                await upsertCodeSamples(codeSample);
                break;

            case 'deleted':
                await archiveCodeSamples(codeSample);
                break;

            default:
                throw new Error('Unexpected value of the codeSample status!')
        }
    }
};
