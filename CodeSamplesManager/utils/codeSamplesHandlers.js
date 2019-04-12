const kenticoCloudService = require('../../shared/Services/KenticoCloudService');
const {
    upsertCodeSampleInfoAsync,
    queryCodeSampleInfoAsync,
    removeCodeSampleInfoAsync,
} = require('./azureTableService');

async function updateCodeSamplesItemAsync(codeSampleItemCodename) {
    const codeSamplesLinkedItems = await queryCodeSampleInfoAsync(codeSampleItemCodename);

    if (codeSamplesLinkedItems.length > 1) {
        await upsertCodeSamplesVariantAsync(codeSampleItemCodename, codeSamplesLinkedItems);
    }

    if (codeSamplesLinkedItems.length === 0) {
        await archiveCodeSamplesVariantAsync(codeSampleItemCodename);
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
                await removeCodeSampleInfoAsync(codeSample.codename, codeSample.identifier);
                break;

            default:
                throw new Error('Unexpected value of the codeSample status!')
        }
    }
}

async function upsertCodeSamplesVariantAsync(codeSampleItemCodename, codeSamplesLinkedItems) {
    const codeSamplesItem = prepareCodeSamplesItem(codeSampleItemCodename);
    const codeSamplesVariant = prepareCodeSamplesVariant(codeSamplesLinkedItems);

    await kenticoCloudService.upsertContentItemVariant(
        codeSamplesItem,
        codeSampleItemCodename,
        codeSamplesVariant,
    );
}

async function archiveCodeSamplesVariantAsync(codeSampleItemCodename) {
    await kenticoCloudService.archiveItemVariantAsync(codeSampleItemCodename);
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
