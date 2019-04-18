const {
    upsertItemVariantAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    createItemVariantAsyncFactory,
    updateVariantAsyncFactory,
    viewItemAsyncFactory,
    isVariantPublishedAsyncFactory,
    isVariantArchivedAsyncFactory,
    checkVariantWorkflowStepFactory,
} = require('./Internal/KenticoCloudServices');

const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const { configuration } = require('../external/configuration');

const createItemVariantAsync = createItemVariantAsyncFactory({
    kenticoCloudClient,
});

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
    configuration,
    isVariantPublishedAsync,
});

const updateVariantAsync = updateVariantAsyncFactory({
    kenticoCloudClient,
    configuration,
    isVariantPublishedAsync,
    isVariantArchivedAsync,
});

const viewItemAsync = viewItemAsyncFactory({
    kenticoCloudClient,
});

const archiveItemVariantAsync = archiveItemVariantAsyncFactory({
    kenticoCloudClient,
    configuration,
    viewItemAsync,
    unpublishVariantAsync,
});

const upsertItemVariantAsync = upsertItemVariantAsyncFactory({
    kenticoCloudClient,
    configuration,
    viewItemAsync,
    createItemVariantAsync,
    updateVariantAsync,
});

module.exports = {
    upsertItemVariantAsync,
    archiveItemVariantAsync,
    viewItemAsync,
};
