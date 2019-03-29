const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const { PUBLISHED_STEP_ID } = require('../utils/constants');

async function createItemAsync(addedContentItem, codename, variant) {
    await kenticoCloudClient.createContentItemAsync(addedContentItem);
    await kenticoCloudClient.upsertLanguageVariantAsync(codename, variant)
}

async function archiveItemVariantAsync(codename) {
    const isItemPublished = await isContentItemPublished(codename);

    if (isItemPublished) {
        await kenticoCloudClient.unpublishLanguageVariantAsync(codename);
    }

    await kenticoCloudClient.archiveContentItemVariantAsync(codename);
}

async function updateItemAsync(updatedContentItem, codename, variant) {
    const isItemPublished = await isContentItemPublished(codename);

    if (isItemPublished) {
        await kenticoCloudClient.createNewContentItemVersionAsync(codename);
    }

    await kenticoCloudClient.updateContentItemAsync(updatedContentItem, codename);
    await kenticoCloudClient.upsertLanguageVariantAsync(codename, variant)
}

async function isContentItemPublished(codename) {
    const item = await kenticoCloudClient.viewLanguageVariantAsync(codename);

    return item.data.workflowStep.id === PUBLISHED_STEP_ID;
}

module.exports = {
    createItemAsync,
    archiveItemVariantAsync,
    updateItemAsync
};
