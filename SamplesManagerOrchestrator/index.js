const df = require('durable-functions');

module.exports = df.orchestrator(function * (context) {
    const CHUNK_SIZE = 10;
    const blobStorageUrl = context.bindingData.input;

    const blobStorageData = yield context.df.callActivity('FragmentsLoader', blobStorageUrl);
    const syncMode = blobStorageData.mode;
    const blobStorageFragments = blobStorageData.codeFragments;

    if (syncMode === 'initialize') {
        yield context.df.callActivity('CodenamesTableCleaner');
    }

    for (const codeFragmentsByIdentifier of blobStorageFragments) {
        for (let i = 0; i < codeFragmentsByIdentifier.length; i = i + CHUNK_SIZE) {
            const codeFragmentsChunk = codeFragmentsByIdentifier.slice(i, i + CHUNK_SIZE);

            yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
            yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
        }
    }
});
