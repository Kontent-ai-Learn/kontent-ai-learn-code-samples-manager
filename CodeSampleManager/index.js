const {
    upsertCodeFragment,
    archiveCodeFragment,
} = require('./utils/codeSampleHandlers');

module.exports = async function (context) {
    const codeFragments = context.bindingData.codeSamples;

    for (const codeFragment of codeFragments) {
        switch (codeFragment.status) {
            case 'added':
            case 'modified':
                await upsertCodeFragment(codeFragment);
                break;

            case 'deleted':
                await archiveCodeFragment(codeFragment.codename);
                break;

            default:
                throw new Error('Unexpected value of the codeFragment status!')
        }
    }
};
