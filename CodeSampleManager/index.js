const {
    upsertCodeSampleVariantAsync,
    archiveCodeSampleAsync,
} = require('./utils/codeSampleHandlers');

module.exports = async function (context) {
    const codeFragments = context.bindingData.codeFragments;

    for (const codeFragment of codeFragments) {
        switch (codeFragment.status) {
            case 'added':
            case 'modified':
                await upsertCodeSampleVariantAsync(codeFragment);
                break;

            case 'deleted':
                await archiveCodeSampleAsync(codeFragment.codename);
                break;

            default:
                throw new Error('Unexpected value of the codeFragment status!')
        }
    }
};
