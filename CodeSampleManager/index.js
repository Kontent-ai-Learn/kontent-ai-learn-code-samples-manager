const Configuration = require('../shared/external/configuration');
const {
    addCodeSampleAsync,
    upsertCodeSampleVariantAsync,
    archiveCodeSampleVariantAsync,
} = require('./utils/codeSampleHandlers');
const StackTrace = require('stacktrace-js');

module.exports = async function (context) {
    context.log(`Starting`);
    const codeFragments = context.bindingData.codeFragments;
    Configuration.setupKenticoKontent();

    context.log(`Code fragments (${codeFragments.length})`, codeFragments);

    for (const codeFragment of codeFragments) {
        context.log(`Processing code fragment '${codeFragment}' started`);
        await processCodeSampleItem(context, codeFragment);
        context.log(`Processing code fragment '${codeFragment}' finished`);
    }
};

async function processCodeSampleItem(context, codeFragment) {
    try {
        context.log(`Code fragment status '${codeFragment.status}'`);
        switch (codeFragment.status) {
            case 'added':
                context.log(`Adding code sample`);
                await addCodeSampleAsync(codeFragment);
                break;

            case 'modified':
                context.log(`Updating code sample`);
                await upsertCodeSampleVariantAsync(codeFragment);
                break;

            case 'deleted':
                context.log(`Deleting code sample`);
                await archiveCodeSampleVariantAsync(codeFragment.codename);
                break;

            default:
                throw 'Unexpected value of the codeFragment status!';
        }
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `message: ${error.message},
                stack: ${error.stack} ${StackTrace.getSync()},
                codename: ${codeFragment.codename}`;
    }
}
