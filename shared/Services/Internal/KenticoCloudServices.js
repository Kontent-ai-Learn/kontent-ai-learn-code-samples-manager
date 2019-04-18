const { LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE } = require('../../utils/constants');

function upsertItemVariantAsyncFactory(deps) {
    return async function (codename, item, variant) {
        const retrievedItem = await deps.viewItemAsync(codename);

        if (retrievedItem === null) {
            await deps.createItemVariantAsync(codename, item, variant);
        } else {
            await deps.updateVariantAsync(codename, variant);
        }
    };
}

function archiveItemVariantAsyncFactory(deps) {
    return async function (codename) {
        const existingItem = await deps.viewItemAsync(codename);

        if (existingItem) {
            await deps.unpublishVariantAsync(codename);
            await deps.kenticoCloudClient.archiveVariantAsync(codename);
        }
    }
}

function unpublishVariantAsyncFactory(deps) {
    return async function (codename) {
        const isPublished = await deps.isVariantPublishedAsync(codename);

        if (isPublished) {
            await deps.kenticoCloudClient.unpublishVariantAsync(codename);
        }
    }
}

function createItemVariantAsyncFactory({ kenticoCloudClient }) {
    return async function (codename, item, itemVariant) {
        await kenticoCloudClient.addItemAsync(item);
        await kenticoCloudClient.upsertVariantAsync(codename, itemVariant);
    }
}

function updateVariantAsyncFactory(deps) {
    return async function (codename, variant) {
        const isPublished = await deps.isVariantPublishedAsync(codename);
        const isArchived = await deps.isVariantArchivedAsync(codename);

        if (isPublished) {
            await deps.kenticoCloudClient.createNewVersionAsync(codename);
        }

        if (isArchived) {
            await deps.kenticoCloudClient.changeVariantWorkflowStepToCopywritingAsync(codename);
        }

        await deps.kenticoCloudClient.upsertVariantAsync(codename, variant)
    }
}

function viewItemAsyncFactory({ kenticoCloudClient }) {
    return async function (codename) {
        try {
            return await kenticoCloudClient.viewItemAsync(codename);
        } catch (error) {
            if (error.errorCode === LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE) {
                return null;
            }

            throw error;
        }
    }
}

function isVariantPublishedAsyncFactory(deps) {
    return async function (codename) {
        return deps.checkVariantWorkflowStep(codename, deps.configuration.publishedStepId);
    }
}

function isVariantArchivedAsyncFactory(deps) {
    return async function (codename) {
        return deps.checkVariantWorkflowStep(codename, deps.configuration.archivedStepId);
    }
}

function checkVariantWorkflowStepFactory({ kenticoCloudClient }) {
    return async function (codename, checkedStepId) {
        const item = await kenticoCloudClient.viewVariantAsync(codename);

        return item.data.workflowStep.id === checkedStepId;
    }
}

module.exports = {
    upsertItemVariantAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    createItemVariantAsyncFactory,
    updateVariantAsyncFactory,
    viewItemAsyncFactory,
    isVariantPublishedAsyncFactory,
    isVariantArchivedAsyncFactory,
    checkVariantWorkflowStepFactory,
};
