const getContentManagementClient = require('../../utils/contentManagmentClient');
const { DEFAULT_LANGUAGE_ID, ARCHIVE_STEP_ID } = require('../../utils/constants');

async function getContentItemAsync(codename) {
    await getContentManagementClient()
        .viewContentItem()
        .byItemCodename(codename)
        .toPromise();
}

async function createContentItemAsync(addedContentItem) {
    await getContentManagementClient()
        .addContentItem()
        .withData(addedContentItem)
        .toPromise();
}

async function updateContentItemAsync(updatedContentItem, codename) {
    await getContentManagementClient()
        .updateContentItem()
        .byItemCodename(codename)
        .withData(updatedContentItem)
        .toPromise();
}

async function archiveContentItemVariantAsync(codename) {
    await getContentManagementClient()
        .changeWorkflowStepOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .byWorkflowStepId(ARCHIVE_STEP_ID)
        .toPromise();
}

async function createNewContentItemVersionAsync(codename) {
    await getContentManagementClient()
        .createNewVersionOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

async function upsertLanguageVariantAsync(codename, variant) {
    await getContentManagementClient()
        .upsertLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .withElements(variant)
        .toPromise();
}

async function viewLanguageVariantAsync(codename) {
    await getContentManagementClient()
        .viewLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

async function unpublishLanguageVariantAsync(codename) {
    await getContentManagementClient()
        .unpublishLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

module.exports = {
    getContentItemAsync,
    createContentItemAsync,
    updateContentItemAsync,
    archiveContentItemVariantAsync,
    createNewContentItemVersionAsync,
    upsertLanguageVariantAsync,
    viewLanguageVariantAsync,
    unpublishLanguageVariantAsync
};
