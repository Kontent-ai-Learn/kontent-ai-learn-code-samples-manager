const df = require('durable-functions');
const { configuration, setupOrchestrator } = require('../shared/external/configuration');

module.exports = df.orchestrator(function * (context) {
    setupOrchestrator();

    const chunkSize = configuration.chunkSize;
    const blobStorageUrl = context.bindingData.input;

    const blobStorageData = yield context.df.callActivity('PrepareCodeFragments', blobStorageUrl);

    if (blobStorageData.mode === 'initialize') {
        yield context.df.callActivity('CleanCodeSampleInfo');
    }

    for (const codeFragmentsByIdentifier of blobStorageData.codeFragments) {
        for (let i = 0; i < codeFragmentsByIdentifier.length; i = i + chunkSize) {
            const codeFragmentsChunk = codeFragmentsByIdentifier.slice(i, i + chunkSize);

            yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
            yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
        }
    }
});
