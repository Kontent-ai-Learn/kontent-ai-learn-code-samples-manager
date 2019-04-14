const kenticoCloudService = require('../../shared/Services/KenticoCloudService');

async function upsertCodeSampleAsync(codeFragment) {
    const codeSampleItem = prepareCodeSampleItem(codeFragment.codename);
    const codeSampleVariant = prepareCodeSampleVariant(codeFragment);

    await kenticoCloudService.upsertItemVariant(
        codeFragment.codename,
        codeSampleItem,
        codeSampleVariant,
    );
}

async function archiveCodeSampleAsync(codename) {
    await kenticoCloudService.archiveItemVariantAsync(codename);
}

function prepareCodeSampleVariant(codeFragment) {
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

function prepareTaxonomyElement(codename, value) {
    return {
        element: {
            codename,
        },
        value: [
            {
                codename: value,
            },
        ],
    }
}

function prepareCodeSampleItem(name) {
    return {
        type: {
            codename: 'code_sample',
        },
        name,
        // Delete when CM API v2 update content item end-point will be fixed and sitemap_locations will not be required
        sitemap_locations: [],
    };
}

module.exports = {
    upsertCodeSampleAsync,
    archiveCodeSampleAsync,
    prepareCodeSampleItem,
};
