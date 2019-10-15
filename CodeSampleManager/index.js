const Configuration = require('../shared/external/configuration');
const {
    addCodeSampleAsync,
    upsertCodeSampleVariantAsync,
    archiveCodeSampleVariantAsync,
} = require('./utils/codeSampleHandlers');

module.exports = async function (context) {
    const codeFragments = context.bindingData.codeFragments;
    Configuration.setupKenticoKontent();

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
                throw 'Unexpected value of the codeFragment status!';
        }
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `message: ${error.message},
                stack: ${error.stack},
                codename: ${codeFragment.codename}`;
    }
}
