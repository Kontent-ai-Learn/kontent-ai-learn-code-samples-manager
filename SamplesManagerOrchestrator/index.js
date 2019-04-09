const df = require('durable-functions');

module.exports = df.orchestrator(function * (context) {
    const CHUNK_SIZE = 2;
    const blobStorageUrl = context.bindingData.input;
    const blobStorageFragments = yield context.df.callActivity('FragmentsLoader', blobStorageUrl);

    for (let i = 0; i < blobStorageFragments.length; i = i + CHUNK_SIZE) {
        const codeFragmentsChunk = blobStorageFragments.slice(i, i + CHUNK_SIZE);

        yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
        yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
    }
});
