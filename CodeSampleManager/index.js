const { setupKenticoCloud } = require('../shared/external/configuration');
const {
    upsertCodeSampleAsync,
    archiveCodeSampleAsync,
} = require('./utils/codeSampleHandlers');

module.exports = async function (context) {
    try {
        const codeFragments = context.bindingData.codeFragments;

        setupKenticoCloud();
        await processCodeSampleItems(codeFragments);
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};

async function processCodeSampleItems(codeFragments) {
    for (const codeFragment of codeFragments) {
        switch (codeFragment.status) {
            case 'added':
            case 'modified':
                await upsertCodeSampleAsync(codeFragment);
                break;

            case 'deleted':
                await archiveCodeSampleAsync(codeFragment.codename);
                break;

            default:
                throw new Error('Unexpected value of the codeFragment status!')
        }
    }
}
