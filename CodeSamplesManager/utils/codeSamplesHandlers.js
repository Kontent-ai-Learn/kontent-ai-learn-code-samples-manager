const { ACTIVE_CODE_SAMPLE_INFO } = require('../../shared/utils/constants');
const kenticoCloudService = require('../../shared/Services');
const {
    upsertCodeSampleInfoAsync,
    getCodeSampleInfoAsync,
    archiveCodeSampleInfoAsync,
} = require('./azureTableService');

async function updateCodeSamplesItemAsync(codeSampleItemCodename) {
    const codeSampleItemsInfo = await getCodeSampleInfoAsync(codeSampleItemCodename);

    const notArchivedCodeSamplesLinkedItems = codeSampleItemsInfo
        .filter(entity => entity.Status['_'] === ACTIVE_CODE_SAMPLE_INFO);

    const codeSamplesLinkedItems = codeSampleItemsInfo
        .map(entity => entity.RowKey['_']);

    if (codeSamplesLinkedItems.length > 1) {
        await upsertCodeSamplesItemVariantAsync(codeSampleItemCodename, codeSamplesLinkedItems);
    }

    if (notArchivedCodeSamplesLinkedItems.length === 0) {
        await kenticoCloudService.archiveItemVariantAsync(codeSampleItemCodename);
    }
}

async function updateCodeSampleInfoAsync(codeSamplesList) {
    for (const codeSample of codeSamplesList) {
        switch (codeSample.status) {
            case 'added':
            case 'modified':
                await upsertCodeSampleInfoAsync(codeSample.codename, codeSample.identifier);
                break;

            case 'deleted':
                await archiveCodeSampleInfoAsync(codeSample.codename, codeSample.identifier);
                break;

            default:
                throw new Error('Unexpected value of the codeSample status!')
        }
    }
}

async function upsertCodeSamplesItemVariantAsync(codeSampleItemCodename, codeSamplesLinkedItems) {
    const codeSamplesItem = prepareCodeSamplesItem(codeSampleItemCodename);
    const codeSamplesVariant = prepareCodeSamplesVariant(codeSamplesLinkedItems);

    await kenticoCloudService.upsertItemVariantAsync(
        codeSampleItemCodename,
        codeSamplesItem,
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
    updateCodeSampleInfoAsync,
    updateCodeSamplesItemAsync,
};
