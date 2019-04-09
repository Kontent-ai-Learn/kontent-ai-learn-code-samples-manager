const kenticoCloudService = require('../../shared/Services/KenticoCloudService');
const {
    addCodenameToTable,
    getCodenamesByIdentifier,
    removeCodenameFromTable
} = require('./azureTableService');

async function upsertCodeSamples(codeSample) {
    await addCodenameToTable(codeSample.codename, codeSample.identifier);
    const codenamesByIdentifier = await getCodenamesByIdentifier(codeSample.identifier);

    if (codenamesByIdentifier.length > 1) {
        const codeSamplesContentItemCodename = codeSample.identifier;
        const codeSamplesItem = prepareCodeSamplesItem(codeSamplesContentItemCodename);
        const codeSamplesVariantElements = prepareCodeSamplesElements(codenamesByIdentifier);

        await kenticoCloudService.upsertContentItemVariant(codeSamplesItem, codeSamplesContentItemCodename, codeSamplesVariantElements);
    }
}

async function archiveCodeSamples(codeSample) {
    await removeCodenameFromTable(codeSample.codename, codeSample.identifier);
    const codenamesByIdentifier = await getCodenamesByIdentifier(codeSample.identifier);

    if (codenamesByIdentifier.length === 0) {
        const codeSamplesContentItemCodename = codeSample.identifier;
        await kenticoCloudService.archiveItemVariantAsync(codeSamplesContentItemCodename);
    }
}

function prepareCodeSamplesItem(identifier) {
    return {
        type: {
            codename: 'code_samples'
        },
        name: identifier,
        // Delete when CM API v2 update content item end-point will be fixed and sitemap_locations will not be required
        sitemap_locations: []
    };
}

function prepareCodeSamplesElements(codenames) {
    const linkedItems = transformCodenamesToLinkItems(codenames);

    return [
        {
            element: {
                codename: 'code_samples'
            },
            value: linkedItems
        }
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
    upsertCodeSamples,
    archiveCodeSamples
};
