const {
    addItemAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    prepareVariantForUpsertAsyncFactory,
    isVariantPublishedAsyncFactory,
    isVariantArchivedAsyncFactory,
    checkVariantWorkflowStepFactory,
    upsertVariantAsyncFactory,
} = require('./Internal/KenticoCloudServices');

const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const { configuration } = require('../external/configuration');

const checkVariantWorkflowStep = checkVariantWorkflowStepFactory(kenticoCloudClient);

const isVariantArchivedAsync = isVariantArchivedAsyncFactory({
    checkVariantWorkflowStep,
    configuration,
});

const isVariantPublishedAsync = isVariantPublishedAsyncFactory({
    checkVariantWorkflowStep,
    configuration,
});

const unpublishVariantAsync = unpublishVariantAsyncFactory({
    kenticoCloudClient,
    isVariantPublishedAsync,
});

const prepareVariantForUpsertAsync = prepareVariantForUpsertAsyncFactory({
    kenticoCloudClient,
    isVariantPublishedAsync,
    isVariantArchivedAsync,
});

const archiveItemVariantAsync = archiveItemVariantAsyncFactory({
    kenticoCloudClient,
    unpublishVariantAsync,
});

const addItemAsync = addItemAsyncFactory(kenticoCloudClient);

const upsertVariantAsync = upsertVariantAsyncFactory({
    kenticoCloudClient,
    prepareVariantForUpsertAsync,
});

module.exports = {
    addItemAsync,
    upsertVariantAsync,
    archiveItemVariantAsync,
};
