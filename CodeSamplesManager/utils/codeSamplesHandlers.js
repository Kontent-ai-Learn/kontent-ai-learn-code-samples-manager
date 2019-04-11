const kenticoCloudService = require('../../shared/Services/KenticoCloudService');
const {
    addCodenameToTable,
    getCodenamesByIdentifier,
    removeCodenameFromTable,
} = require('./azureTableService');

async function updateCodeSamplesContentItemInKenticoCloud(codeSample) {
    const codenamesByIdentifier = await getCodenamesByIdentifier(codeSample.identifier);

    if (codenamesByIdentifier.length > 1) {
        upsertCodeSamples(codeSample, codenamesByIdentifier);
    }

    if (codenamesByIdentifier.length === 0) {
        archiveCodeSamples(codeSample);
    }
}

async function updateCodeSamplesCodenamesTable(codeSamplesList) {
    for (const codeSample of codeSamplesList) {
        switch (codeSample.status) {
            case 'added':
            case 'modified':
                await addCodenameToTable(codeSample.codename, codeSample.identifier);
                break;

            case 'deleted':
                await removeCodenameFromTable(codeSample.codename, codeSample.identifier);
                break;

            default:
                throw new Error('Unexpected value of the codeSample status!')
        }
    }
}

async function upsertCodeSamples(codeSample, codenamesByIdentifier) {
    const codeSamplesContentItemCodename = codeSample.identifier;
    const codeSamplesItem = prepareCodeSamplesItem(codeSamplesContentItemCodename);
    const codeSamplesVariantElements = prepareCodeSamplesElements(codenamesByIdentifier);

    await kenticoCloudService.upsertContentItemVariant(
        codeSamplesItem,
        codeSamplesContentItemCodename,
        codeSamplesVariantElements,
    );
}

async function archiveCodeSamples(codeSample) {
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

function prepareCodeSamplesElements(codenames) {
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
    updateCodeSamplesCodenamesTable,
    updateCodeSamplesContentItemInKenticoCloud,
};
