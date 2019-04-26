const {
    addItemAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    updateVariantAsyncFactory,
    viewItemAsyncFactory,
    viewVariantAsyncFactory,
    isVariantPublishedAsyncFactory,
    isVariantArchivedAsyncFactory,
    checkVariantWorkflowStepFactory,
    upsertVariantAsyncFactory,
} = require('./Internal/KenticoCloudServices');

const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const { configuration } = require('../external/configuration');

const checkVariantWorkflowStep = checkVariantWorkflowStepFactory({
    kenticoCloudClient,
});

const isVariantArchivedAsync = isVariantArchivedAsyncFactory({
    kenticoCloudClient,
    configuration,
    checkVariantWorkflowStep,
});

const isVariantPublishedAsync = isVariantPublishedAsyncFactory({
    kenticoCloudClient,
    configuration,
    checkVariantWorkflowStep,
});

const unpublishVariantAsync = unpublishVariantAsyncFactory({
    kenticoCloudClient,
    isVariantPublishedAsync,
});

const updateVariantAsync = updateVariantAsyncFactory({
    kenticoCloudClient,
    isVariantPublishedAsync,
    isVariantArchivedAsync,
});

const viewItemAsync = viewItemAsyncFactory({
    kenticoCloudClient,
});

const viewVariantAsync = viewVariantAsyncFactory({
    kenticoCloudClient,
});

const archiveItemVariantAsync = archiveItemVariantAsyncFactory({
    kenticoCloudClient,
    viewItemAsync,
    unpublishVariantAsync,
});

const upsertItemAsync = addItemAsyncFactory({
    kenticoCloudClient,
    viewItemAsync,
});

const upsertVariantAsync = upsertVariantAsyncFactory({
    kenticoCloudClient,
    viewVariantAsync,
    updateVariantAsync,
});

module.exports = {
    upsertItemAsync,
    upsertVariantAsync,
    archiveItemVariantAsync,
    viewItemAsync,
};
