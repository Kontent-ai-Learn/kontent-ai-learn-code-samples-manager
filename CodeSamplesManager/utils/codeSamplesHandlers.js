const kenticoCloudService = require('../../shared/Services/KenticoCloudService');
const {
    upsertCodeSampleInfoAsync,
    queryCodeSampleInfoAsync,
    removeCodeSampleInfoAsync,
} = require('./azureTableService');

async function updateCodeSamplesItemAsync(codeSample) {
    const codeSamplesLinkedItems = await queryCodeSampleInfoAsync(codeSample.identifier);

    if (codeSamplesLinkedItems.length > 1) {
        await upsertCodeSamplesVariantAsync(codeSample, codeSamplesLinkedItems);
    }

    if (codeSamplesLinkedItems.length === 0) {
        await archiveCodeSamplesVariantAsync(codeSample);
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

async function upsertCodeSamplesVariantAsync(codeSample, codenamesByIdentifier) {
    const codeSamplesContentItemCodename = codeSample.identifier;
    const codeSamplesItem = prepareCodeSamplesItem(codeSamplesContentItemCodename);
    const codeSamplesVariant = prepareCodeSamplesVariant(codenamesByIdentifier);

    await kenticoCloudService.upsertContentItemVariant(
        codeSamplesItem,
        codeSamplesContentItemCodename,
        codeSamplesVariant,
    );
}

async function archiveCodeSamplesVariantAsync(codeSample) {
    const codeSamplesContentItemCodename = codeSample.identifier;
    await kenticoCloudService.archiveItemVariantAsync(codeSamplesContentItemCodename);
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
    let result = [];

    for (const index in codenames) {
        result = [...result, { codename: codenames[index] }];
    }

    return result;
}

module.exports = {
    updateCodeSampleInfoAsync,
    updateCodeSamplesItemAsync,
};
