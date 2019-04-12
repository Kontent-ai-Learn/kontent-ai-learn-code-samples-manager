const df = require('durable-functions');
const { configVariables, setupConfiguration } = require('../shared/config/configuration');

module.exports = df.orchestrator(function * (context) {
    setupConfiguration();

    const CHUNK_SIZE = configVariables.chunkSize;
    const blobStorageUrl = context.bindingData.input;

    const blobStorageData = yield context.df.callActivity('PrepareCodeFragments', blobStorageUrl);

    if (blobStorageData.mode === 'initialize') {
        yield context.df.callActivity('CleanCodeSampleInfo');
    }

    for (const codeFragmentsByIdentifier of blobStorageData.codeFragments) {
        for (let i = 0; i < codeFragmentsByIdentifier.length; i = i + CHUNK_SIZE) {
            const codeFragmentsChunk = codeFragmentsByIdentifier.slice(i, i + CHUNK_SIZE);

            yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
            yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
        }
    }
});
