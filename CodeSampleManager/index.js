const { setupKenticoCloud } = require('../shared/external/configuration');
const {
    addCodeSampleAsync,
    upsertCodeSampleVariantAsync,
    archiveCodeSampleVariantAsync,
} = require('./utils/codeSampleHandlers');

module.exports = async function (context) {
    const codeFragments = context.bindingData.codeFragments;
    setupKenticoCloud();

    for (const codeFragment of codeFragments) {
        await processCodeSampleItem(codeFragment);
    }
};

async function processCodeSampleItem(codeFragment) {
    try {
        switch (codeFragment.status) {
            case 'added':
                await addCodeSampleAsync(codeFragment);
                break;

            case 'modified':
                await upsertCodeSampleVariantAsync(codeFragment);
                break;

            case 'deleted':
                await archiveCodeSampleVariantAsync(codeFragment.codename);
                break;

            default:
                throw new Error('Unexpected value of the codeFragment status!')
        }
    } catch (error) {
        throw {
            message: error.message,
            stack: error.stack,
            codename: codeFragment.codename,
        };
    }
}
