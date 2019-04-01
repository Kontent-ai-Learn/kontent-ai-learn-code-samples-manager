const { getCodeSamplesCodename } = require('./processCodename');
const kenticoCloudService = require('../../shared/Services/KenticoCloudService');
const {
    addCodenameToTable,
    getAllCodenamesWithSameBase,
    removeCodenameFromTable
} = require('./azureTableService');

async function upsertCodeSamples(codeSample) {
    await addCodenameToTable(codeSample.codename);

    const codeNamesWithSameBase = await getAllCodenamesWithSameBase(codeSample.codename);

    if (codeNamesWithSameBase.length > 1) {
        const codeSamplesItem = prepareCodeSamplesItem(codeSample.codename);
        const codeSamplesVariantElements = prepareCodeSamplesElements(codeNamesWithSameBase);

        await kenticoCloudService.upsertContentItemVariant(codeSamplesItem, getCodeSamplesCodename(codeSample.codename), codeSamplesVariantElements);
    }
}

async function archiveCodeSamples(codeSample) {
    await removeCodenameFromTable(codeSample.codename);

    const codeNamesWithSameBase = await getAllCodenamesWithSameBase(codeSample.codename);

    if (codeNamesWithSameBase.length === 0) {
        await kenticoCloudService.archiveItemVariantAsync(getCodeSamplesCodename(codeSample.codename));
    }
}

function prepareCodeSamplesItem(codename) {
    return {
        type: {
            codename: 'code_samples'
        },
        name: getCodeSamplesCodename(codename),
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
}
