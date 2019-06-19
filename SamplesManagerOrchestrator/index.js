const axios = require('axios');
const df = require('durable-functions');
const { configuration, setupOrchestrator } = require('../shared/external/configuration');

function sendNotification(activityTitle, mode, text) {
    axios.post(configuration.notifierEndpoint, {
        activityTitle,
        mode,
        text,
    });
}

function handleError(error) {
    sendNotification(
        'Samples manager failed.',
        'error',
        `Sample manager failed while processing item with codename ${error.codename}. Message: ${error.message}`
    );

    /** This throw is required for correct logging of exceptions in Azure */
   throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
}

function * processFragments(context, codeFragments, chunkSize) {
    for (const codeFragmentsByIdentifier of codeFragments) {
        for (let i = 0; i < codeFragmentsByIdentifier.length; i = i + chunkSize) {
            const codeFragmentsChunk = codeFragmentsByIdentifier.slice(i, i + chunkSize);

            yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
            yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
        }
    }
}

module.exports = df.orchestrator(function * (context) {
    setupOrchestrator();

    try {
        const chunkSize = configuration.chunkSize;
        const blobStorageData = yield context.df.callActivity('PrepareCodeFragments', context.bindingData.input);

        if (blobStorageData.mode === 'initialize') {
            yield context.df.callActivity('CleanCodeSampleInfo');
        }

        yield * processFragments(context, blobStorageData.codeFragments, chunkSize);

        sendNotification(
            'Samples manager finished successfully.',
            'success',
            'Sample manager finished successfully. Code between GitHub and Kentico Cloud is synchronized.'
        );
    } catch (error) {
        handleError(error);
    }
});
