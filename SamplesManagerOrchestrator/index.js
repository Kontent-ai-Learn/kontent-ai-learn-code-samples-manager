const { TopicCredentials } = require('ms-rest-azure');
const { EventGridClient } = require('azure-eventgrid');
const Configuration = require('../shared/external/configuration');
const {
    publishEventsCreator,
    eventComposer,
} = require('./utils/eventGridClient');
const df = require('durable-functions');

async function sendNotification(activityTitle, text) {
    const eventGridKey = process.env['EventGrid.Notification.Key'];
    const host = process.env['EventGrid.Notification.Endpoint'];

    if (!eventGridKey || !host) {
        throw new Error('Undefined env property provided');
    }

    const topicCredentials = new TopicCredentials(eventGridKey);
    const eventGridClient = new EventGridClient(topicCredentials);
    const publishEvents = publishEventsCreator({ eventGridClient, host });

    const event = eventComposer(activityTitle, text);
    await publishEvents([event]);
}

async function handleError(error) {
    await sendNotification(
        'Samples manager failed.',
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
    Configuration.setupOrchestrator();

    try {
        const chunkSize = Configuration.chunkSize;
        const blobStorageData = yield context.df.callActivity('PrepareCodeFragments', context.bindingData.input);

        if (blobStorageData.mode === 'initialize') {
            yield context.df.callActivity('CleanCodeSampleInfo');
        }

        yield * processFragments(context, blobStorageData.codeFragments, chunkSize);
    } catch (error) {
        yield handleError(error);
    }
});
