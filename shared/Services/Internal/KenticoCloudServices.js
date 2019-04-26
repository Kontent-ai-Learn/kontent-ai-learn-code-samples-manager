const {
    LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE,
    ITEM_NOT_FOUND_ERROR_CODE,
} = require('../../utils/constants');

function addItemAsyncFactory(deps) {
    return async function (codename, item) {
        const retrievedItem = await deps.viewItemAsync(codename);

        if (retrievedItem === null) {
            await deps.kenticoCloudClient.addItemAsync(item);
        }
    };
}

function upsertVariantAsyncFactory(deps) {
    return async function (codename, variant) {
        const retrievedVariant = await deps.viewVariantAsync(codename);

        if (retrievedVariant === null) {
            await deps.kenticoCloudClient.upsertVariantAsync(codename, variant);
        } else {
            await deps.updateVariantAsync(codename, variant);
        }
    }
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
    return function (codename) {
        return ensureEntityAsync(
            kenticoCloudClient.viewItemAsync,
            ITEM_NOT_FOUND_ERROR_CODE,
            codename
        );
    }
}

function viewVariantAsyncFactory({ kenticoCloudClient }) {
    return function (codename) {
        return ensureEntityAsync(
            kenticoCloudClient.viewVariantAsync,
            LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE,
            codename
        );
    }
}

async function ensureEntityAsync(viewEntityAsync, notFoundErrorCode, codename) {
    try {
        return await viewEntityAsync(codename);
    } catch (error) {
        if (error.errorCode === notFoundErrorCode) {
            return null;
        }

        throw error;
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
    addItemAsyncFactory,
    upsertVariantAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    updateVariantAsyncFactory,
    viewItemAsyncFactory,
    isVariantPublishedAsyncFactory,
    isVariantArchivedAsyncFactory,
    checkVariantWorkflowStepFactory,
    viewVariantAsyncFactory,
};
