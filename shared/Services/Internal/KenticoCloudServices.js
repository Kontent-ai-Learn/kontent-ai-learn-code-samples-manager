function addItemAsyncFactory(kenticoCloudClient) {
    return async function (codename, item) {
        const retrievedItem = await kenticoCloudClient.viewItemAsync(codename);

        if (retrievedItem === null) {
            await kenticoCloudClient.addItemAsync(item);
        }
    };
}

function upsertVariantAsyncFactory({ kenticoCloudClient, prepareVariantForUpsertAsync }) {
    return async function (codename, variant) {
        const retrievedVariant = await kenticoCloudClient.viewVariantAsync(codename);

        if (retrievedVariant !== null) {
            await prepareVariantForUpsertAsync(codename);
        }

        await kenticoCloudClient.upsertVariantAsync(codename, variant)
    }
}

function prepareVariantForUpsertAsyncFactory(deps) {
    return async function (codename) {
        const kenticoCloudClient = deps.kenticoCloudClient;

        const isPublished = await deps.isVariantPublishedAsync(codename);
        const isArchived = await deps.isVariantArchivedAsync(codename);

        if (isPublished) {
            await kenticoCloudClient.createNewVersionAsync(codename);
        }

        if (isArchived) {
            await kenticoCloudClient.changeVariantWorkflowStepToCopywritingAsync(codename);
        }
    }
}

function archiveItemVariantAsyncFactory({ kenticoCloudClient, unpublishVariantAsync }) {
    return async function (codename) {
        const existingItem = await kenticoCloudClient.viewItemAsync(codename);

        if (existingItem) {
            await unpublishVariantAsync(codename);
            await kenticoCloudClient.archiveVariantAsync(codename);
        }
    }
}

function unpublishVariantAsyncFactory({ kenticoCloudClient, isVariantPublishedAsync }) {
    return async function (codename) {
        const isPublished = await isVariantPublishedAsync(codename);

        if (isPublished) {
            await kenticoCloudClient.unpublishVariantAsync(codename);
        }
    }
}

function isVariantPublishedAsyncFactory({ checkVariantWorkflowStep, configuration }) {
    return async function (codename) {
        return checkVariantWorkflowStep(codename, configuration.publishedStepId);
    }
}

function isVariantArchivedAsyncFactory({ checkVariantWorkflowStep, configuration }) {
    return async function (codename) {
        return checkVariantWorkflowStep(codename, configuration.archivedStepId);
    }
}

function checkVariantWorkflowStepFactory(kenticoCloudClient) {
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
    prepareVariantForUpsertAsyncFactory,
    isVariantPublishedAsyncFactory,
    isVariantArchivedAsyncFactory,
    checkVariantWorkflowStepFactory,
};
