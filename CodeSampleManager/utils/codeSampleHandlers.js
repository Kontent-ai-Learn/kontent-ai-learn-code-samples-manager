const kenticoCloudService = require('../../shared/Services/KenticoCloudService');

async function upsertCodeFragment(codeFragment) {
    const codeSampleItem = prepareCodeSampleItem(codeFragment.codename);
    const codeSampleVariantElements = prepareCodeSampleElements(codeFragment);

    await kenticoCloudService.upsertContentItemVariant(
        codeSampleItem,
        codeFragment.codename,
        codeSampleVariantElements,
    );
}

async function archiveCodeFragment(codename) {
    await kenticoCloudService.archiveItemVariantAsync(codename);
}

function prepareCodeSampleElements(codeFragment) {
    const contentElement = {
        element: {
            codename: 'code',
        },
        value: codeFragment.content,
    };
    const languageElement = prepareTaxonomyElement('programming_language', codeFragment.language);
    const platformElement = prepareTaxonomyElement('platform', codeFragment.platform);

    return [
        contentElement,
        languageElement,
        platformElement,
    ];
}

function prepareTaxonomyElement(elementCodename, valueCodename) {
    return {
        element: {
            codename: elementCodename,
        },
        value: [
            {
                codename: valueCodename,
            },
        ],
    }
}

function prepareCodeSampleItem(codename) {
    return {
        type: {
            codename: 'code_sample',
        },
        name: codename,
        // Delete when CM API v2 update content item end-point will be fixed and sitemap_locations will not be required
        sitemap_locations: [],
    };
}

module.exports = {
    upsertCodeFragment,
    archiveCodeFragment,
    prepareCodeSampleItem,
};
