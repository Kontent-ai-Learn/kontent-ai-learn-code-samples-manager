const { getContentManagementClient } = require('../../utils/getContentManagementClient');
const { DEFAULT_LANGUAGE_ID } = require('../../utils/constants');
const { configuration } = require('../../external/configuration');
const {
    ITEM_NOT_FOUND_ERROR_CODE,
    LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE,
} = require('../../utils/constants');

function viewItemAsync(codename) {
    return getContentManagementClient()
        .viewContentItem()
        .byItemCodename(codename)
        .toPromise()
        .catch(error => handleNotFoundError(error, ITEM_NOT_FOUND_ERROR_CODE));
}

function addItemAsync(item) {
    return getContentManagementClient()
        .addContentItem()
        .withData(item)
        .toPromise();
}

function archiveVariantAsync(codename) {
    return changeWorkflowStepOfVariantAsync(codename, configuration.archivedStepId);
}

function changeVariantWorkflowStepToCopywritingAsync(codename) {
    return changeWorkflowStepOfVariantAsync(codename, configuration.copywritingStepId);
}

function changeWorkflowStepOfVariantAsync(codename, workflowStepId) {
    return getContentManagementClient()
        .changeWorkflowStepOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .byWorkflowStepId(workflowStepId)
        .toPromise();
}

function createNewVersionAsync(codename) {
    return getContentManagementClient()
        .createNewVersionOfLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

function upsertVariantAsync(codename, variant) {
    return getContentManagementClient()
        .upsertLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .withElements(variant)
        .toPromise();
}

function viewVariantAsync(codename) {
    return getContentManagementClient()
        .viewLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise()
        .catch(error => handleNotFoundError(error, LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE));
}

function unpublishVariantAsync(codename) {
    return getContentManagementClient()
        .unpublishLanguageVariant()
        .byItemCodename(codename)
        .byLanguageId(DEFAULT_LANGUAGE_ID)
        .toPromise();
}

function handleNotFoundError(error, expectedNotFoundErrorCode) {
    if (error.errorCode === expectedNotFoundErrorCode) {
        return null;
    }

    throw error;
}

module.exports = {
    viewItemAsync,
    addItemAsync,
    archiveVariantAsync,
    createNewVersionAsync,
    upsertVariantAsync,
    viewVariantAsync,
    unpublishVariantAsync,
    changeVariantWorkflowStepToCopywritingAsync,
};
