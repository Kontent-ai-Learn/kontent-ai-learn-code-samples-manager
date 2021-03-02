const { ACTIVE_CODE_SAMPLE_INFO } = require('../../shared/utils/constants');
const kenticoCloudService = require('../../shared/Services');
const { getCodeSampleInfoAsync } = require('./azureTableService');

const manageCodeSamplesAsync = manageCodeSamplesAsyncFactory({
    getCodeSampleInfoAsync,
    upsertCodeSamplesItemAsync,
    kenticoCloudService,
});

function manageCodeSamplesAsyncFactory(deps) {
    return async function (codeSampleItemCodename) {
        const codeSampleItemsInfo = await deps.getCodeSampleInfoAsync(codeSampleItemCodename);

        const notArchivedCodeSamplesLinkedItems = codeSampleItemsInfo
            .filter(entity => entity.Status._ === ACTIVE_CODE_SAMPLE_INFO);

        const codeSamplesLinkedItems = codeSampleItemsInfo
            .map(entity => entity.RowKey._);

        if (codeSamplesLinkedItems.length > 1) {
            await deps.upsertCodeSamplesItemAsync(codeSampleItemCodename, codeSamplesLinkedItems);
        }

        if (notArchivedCodeSamplesLinkedItems.length === 0) {
            await deps.kenticoCloudService.archiveItemVariantAsync(codeSampleItemCodename);
        }
    }
}

async function upsertCodeSamplesItemAsync(codeSampleItemCodename, codeSamplesLinkedItems) {
    const codeSamplesItem = prepareCodeSamplesItem(codeSampleItemCodename);

    await kenticoCloudService.addItemAsync(
        codeSampleItemCodename,
        codeSamplesItem
    );

    await upsertCodeSamplesVariantAsync(codeSampleItemCodename, codeSamplesLinkedItems);
}

async function upsertCodeSamplesVariantAsync(codeSampleItemCodename, codeSamplesLinkedItems) {
    const codeSamplesVariant = prepareCodeSamplesVariant(codeSamplesLinkedItems);

    await kenticoCloudService.upsertVariantAsync(
        codeSampleItemCodename,
        codeSamplesVariant,
    );
}

function prepareCodeSamplesItem(identifier) {
    return {
        type: {
            codename: 'code_samples',
        },
        name: identifier,
        // Delete when CM API v2 update content item end-point will be fixed and sitemap_locations will not be required
        sitemap_locations: [],
    };
}

function prepareCodeSamplesVariant(codenames) {
    const linkedItems = transformCodenamesToLinkItems(codenames);

    return [
        {
            element: {
                codename: 'code_samples',
            },
            value: linkedItems,
        },
    ];
}

function transformCodenamesToLinkItems(codenames) {
    return codenames.map(codename => ({ codename }));
}

module.exports = {
    manageCodeSamplesAsync,
    manageCodeSamplesAsyncFactory,
};
