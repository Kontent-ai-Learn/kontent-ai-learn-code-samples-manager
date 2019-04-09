const df = require('durable-functions');

module.exports = async function (context, eventGridEvent) {
    const client = df.getClient(context);
    const instanceId = await client.startNew(
        'SamplesManagerOrchestrator',
        undefined,
        eventGridEvent.data.url);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.eventGridEvent, instanceId);
};
