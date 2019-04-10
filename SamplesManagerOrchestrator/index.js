const df = require('durable-functions');

module.exports = df.orchestrator(function * (context) {
    const CHUNK_SIZE = 10;
    const blobStorageUrl = context.bindingData.input;

    const blobStorageData = yield context.df.callActivity('FragmentsLoader', blobStorageUrl);
    const blobStorageFragments = blobStorageData.codeFragments;
    const syncMode = blobStorageData.mode;

    if (syncMode === 'initialize') {
        yield context.df.callActivity('CodenamesTableCleaner');
    }

    for (let i = 0; i < blobStorageFragments.length; i = i + CHUNK_SIZE) {
        const codeFragmentsChunk = blobStorageFragments.slice(i, i + CHUNK_SIZE);

        yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
        yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
    }
});
