const getContentManagementClient = require('../../utils/contentManagmentClient');
const { DEFAULT_LANGUAGE_ID } = require('../../utils/constants');
const { keys } = require('../../utils/configuration');

function getContentItemAsync(codename) {
    return getContentManagementClient()
        .viewContentItem()
        .byItemCodename(codename)
        .toPromise();
}

function createContentItemAsync(addedContentItem) {
    return getContentManagementClient()
        .addContentItem()
        .withData(addedContentItem)
        .toPromise();
}

function updateContentItemAsync(updatedContentItem, codename) {
    return getContentManagementClient()
        .updateContentItem()
        .byItemCodename(codename)
        .withData(updatedContentItem)
        .toPromise();
}

function archiveContentItemVariantAsync(codename) {
    return changeWorkflowStepAsync(codename, keys.archivedStepId);
}

function changeContentItemVariantWorkflowStepToDraftAsync(codename) {
    return changeWorkflowStepAsync(codename, keys.draftStepId);
}

function changeWorkflowStepAsync(codename, newWorkflowStepId) {
    return getContentManagementClient()
    .changeWorkflowStepOfLanguageVariant()
    .byItemCodename(codename)
    .byLanguageId(DEFAULT_LANGUAGE_ID)
    .byWorkflowStepId(newWorkflowStepId)
    .toPromise();
}

function createNewContentItemVersionAsync(codename) {
    return getContentManagementClient()
        .createNewVersionOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

function upsertLanguageVariantAsync(codename, variant) {
    return getContentManagementClient()
        .upsertLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .withElements(variant)
        .toPromise();
}

function viewLanguageVariantAsync(codename) {
    return getContentManagementClient()
        .viewLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

function unpublishLanguageVariantAsync(codename) {
    return getContentManagementClient()
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
    unpublishLanguageVariantAsync,
    changeContentItemVariantWorkflowStepToDraftAsync
};
