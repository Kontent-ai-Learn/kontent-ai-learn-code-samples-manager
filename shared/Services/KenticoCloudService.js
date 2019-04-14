const kenticoCloudClient = require('./Clients/KenticoCloudClient');
const { LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE } = require('../utils/constants');
const { configuration } = require('../config/configuration');

async function upsertItemVariant(codename, item, variant) {
    const retrievedItem = await viewItemAsync(codename);

    if (retrievedItem === null) {
        await createItemVariantAsync(codename, item, variant);
    } else {
        await updateVariantAsync(codename, variant);
    }
}

async function archiveItemVariantAsync(codename) {
    const existingItem = await viewItemAsync(codename);

    if (existingItem) {
        const isPublished = await isVariantPublishedAsync(codename);

        if (isPublished) {
            await kenticoCloudClient.unpublishVariantAsync(codename);
        }

        await kenticoCloudClient.archiveVariantAsync(codename);
    }
}

async function createItemVariantAsync(codename, item, itemVariant) {
    await kenticoCloudClient.addItemAsync(item);
    await kenticoCloudClient.upsertVariantAsync(codename, itemVariant);
}

async function updateVariantAsync(codename, variant) {
    const isPublished = await isVariantPublishedAsync(codename);
    const isArchived = await isVariantArchivedAsync(codename);

    if (isPublished) {
        await kenticoCloudClient.createNewVersionAsync(codename);
    }

    if (isArchived) {
        await kenticoCloudClient.changeVariantWorkflowStepToCopywritingAsync(codename);
    }

    await kenticoCloudClient.upsertVariantAsync(codename, variant)
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

async function isVariantPublishedAsync(codename) {
    const item = await kenticoCloudClient.viewVariantAsync(codename);

    return item.data.workflowStep.id === configuration.publishedStepId;
}

async function isVariantArchivedAsync(codename) {
    const item = await kenticoCloudClient.viewVariantAsync(codename);

    return item.data.workflowStep.id === configuration.archivedStepId;
}

module.exports = {
    archiveItemVariantAsync,
    upsertItemVariant,
};
