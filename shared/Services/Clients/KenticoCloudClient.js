const getContentManagementClient = require('../../utils/contentManagmentClient');
const { DEFAULT_LANGUAGE_ID } = require('../../utils/constants');
const { configVariables } = require('../../config/configuration');

function viewItemAsync(codename) {
    return getContentManagementClient()
        .viewContentItem()
        .byItemCodename(codename)
        .toPromise();
}

function addItemAsync(addedContentItem) {
    return getContentManagementClient()
        .addContentItem()
        .withData(addedContentItem)
        .toPromise();
}

function archiveItemVariantAsync(codename) {
    return changeWorkflowStepOfItemVariantAsync(codename, configVariables.archivedStepId);
}

function changeItemVariantWorkflowStepToCopywritingAsync(codename) {
    return changeWorkflowStepOfItemVariantAsync(codename, configVariables.copywritingStepId);
}

function changeWorkflowStepOfItemVariantAsync(codename, newWorkflowStepId) {
    return getContentManagementClient()
        .changeWorkflowStepOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .byWorkflowStepId(newWorkflowStepId)
        .toPromise();
}

function createNewItemVersionAsync(codename) {
    return getContentManagementClient()
        .createNewVersionOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

function upsertItemVariantAsync(codename, variant) {
    return getContentManagementClient()
        .upsertLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .withElements(variant)
        .toPromise();
}

function viewItemVariantAsync(codename) {
    return getContentManagementClient()
        .viewLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

function unpublishItemVariantAsync(codename) {
    return getContentManagementClient()
        .unpublishLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

module.exports = {
    viewItemAsync,
    addItemAsync,
    archiveItemVariantAsync,
    createNewItemVersionAsync,
    upsertItemVariantAsync,
    viewItemVariantAsync,
    unpublishItemVariantAsync,
    changeItemVariantWorkflowStepToCopywritingAsync,
};
