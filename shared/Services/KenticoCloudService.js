const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const { LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE } = require('../utils/constants');
const { configVariables } = require('../config/configuration');

async function upsertContentItemVariant(item, codename, itemVariant) {
    const retrievedItem = await viewItemAsync(codename);

    if (retrievedItem === null) {
        await createItemVariantAsync(item, codename, itemVariant);
    } else {
        await updateItemVariantAsync(codename, itemVariant);
    }
}

async function archiveItemVariantAsync(codename) {
    const existContentItem = await viewItemAsync(codename) !== null;

    if (existContentItem) {
        const isItemPublished = await isItemVariantPublishedAsync(codename);

        if (isItemPublished) {
            await kenticoCloudClient.unpublishItemVariantAsync(codename);
        }

        await kenticoCloudClient.archiveItemVariantAsync(codename);
    }
}

async function createItemVariantAsync(item, codename, itemVariant) {
    await kenticoCloudClient.addItemAsync(item);
    await kenticoCloudClient.upsertItemVariantAsync(codename, itemVariant);
}

async function updateItemVariantAsync(codename, itemVariant) {
    const isItemVariantPublished = await isItemVariantPublishedAsync(codename);
    const isItemVariantArchived = await isItemVariantArchivedAsync(codename);

    if (isItemVariantPublished) {
        await kenticoCloudClient.createNewItemVersionAsync(codename);
    }

    if (isItemVariantArchived) {
        await kenticoCloudClient.changeItemVariantWorkflowStepToCopywritingAsync(codename);
    }

    await kenticoCloudClient.upsertItemVariantAsync(codename, itemVariant)
}

async function viewItemAsync(codename) {
    try {
        return await kenticoCloudClient.viewItemAsync(codename);
    } catch (error) {
        if (error.errorCode === LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE) {
            return null;
        }

        throw error;
    }
}

async function isItemVariantPublishedAsync(codename) {
    const item = await kenticoCloudClient.viewItemVariantAsync(codename);

    return item.data.workflowStep.id === configVariables.publishedStepId;
}

async function isItemVariantArchivedAsync(codename) {
    const item = await kenticoCloudClient.viewItemVariantAsync(codename);

    return item.data.workflowStep.id === configVariables.archivedStepId;
}

module.exports = {
    archiveItemVariantAsync,
    upsertContentItemVariant,
};
