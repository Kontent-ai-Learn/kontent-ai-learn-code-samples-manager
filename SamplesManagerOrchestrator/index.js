const df = require('durable-functions');
const { configVariables, setupConfiguration } = require('../shared/config/configuration');

module.exports = df.orchestrator(function * (context) {
    setupConfiguration();
    const CHUNK_SIZE = configVariables.chunkSize;
    const blobStorageUrl = context.bindingData.input;

    const blobStorageData = yield context.df.callActivity('PrepareCodeFragments', blobStorageUrl);
    const syncMode = blobStorageData.mode;
    const blobStorageFragments = blobStorageData.codeFragments;

    if (syncMode === 'initialize') {
        yield context.df.callActivity('CleanCodeSampleInfo');
    }

    for (const codeFragmentsByIdentifier of blobStorageFragments) {
        for (let i = 0; i < codeFragmentsByIdentifier.length; i = i + CHUNK_SIZE) {
            const codeFragmentsChunk = codeFragmentsByIdentifier.slice(i, i + CHUNK_SIZE);

            yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
            yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
        }
    }
});
