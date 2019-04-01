const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const {
    PUBLISHED_STEP_ID,
    LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE,
    ARCHIVE_STEP_ID
} = require('../utils/constants');

async function createItemAsync(addedContentItem, codename, variant) {
    await kenticoCloudClient.createContentItemAsync(addedContentItem);
    await kenticoCloudClient.upsertLanguageVariantAsync(codename, variant);
}

async function archiveItemVariantAsync(codename) {
    const existContentItem = await getContentItem(codename) !== null;

    if (existContentItem) {
        const isItemPublished = await isContentItemPublished(codename);

        if (isItemPublished) {
            await kenticoCloudClient.unpublishLanguageVariantAsync(codename);
        }

        await kenticoCloudClient.archiveContentItemVariantAsync(codename);
    }
}

async function updateItemAsync(updatedContentItem, codename, variant) {
    const isItemPublished = await isContentItemPublished(codename);

    if (isItemPublished) {
        await kenticoCloudClient.createNewContentItemVersionAsync(codename);
    }

    if (isContentItemArchived) {
        await kenticoCloudClient.changeContentItemVariantWorkflowStepToDraftAsync(codename);
    }

    await kenticoCloudClient.updateContentItemAsync(updatedContentItem, codename);
    await kenticoCloudClient.upsertLanguageVariantAsync(codename, variant)
}

async function upsertContentItemVariant(contentItem, codename, variant) {
    const kenticoCloudContentItem = await getContentItem(codename);

    if (kenticoCloudContentItem === null) {
        await createItemAsync(contentItem, codename, variant);
    } else {
        await updateItemAsync(contentItem, codename, variant);
    }
}

async function getContentItem(codename) {
    try {
        return await kenticoCloudClient.getContentItemAsync(codename);
    } catch (error) {
        if (error.errorCode === LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE) {
            return null;
        }
    }
}

async function isContentItemPublished(codename) {
    const item = await kenticoCloudClient.viewLanguageVariantAsync(codename);

    return item.data.workflowStep.id === PUBLISHED_STEP_ID;
}

async function isContentItemArchived(codename) {
    const item = await kenticoCloudClient.viewLanguageVariantAsync(codename);

    return item.data.workflowStep.id === ARCHIVE_STEP_ID;
}

module.exports = {
    archiveItemVariantAsync,
    upsertContentItemVariant
};
