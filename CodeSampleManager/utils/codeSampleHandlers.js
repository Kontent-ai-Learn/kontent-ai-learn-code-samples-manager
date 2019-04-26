const kenticoCloudService = require('../../shared/Services');

async function addCodeSampleAsync(codeFragment) {
    const codeSampleItem = prepareCodeSampleItem(codeFragment.codename);

    await kenticoCloudService.upsertItemAsync(
        codeFragment.codename,
        codeSampleItem,
    );

    await updateCodeSampleAsync(codeFragment);
}

async function updateCodeSampleAsync(codeFragment) {
    const codeSampleVariant = prepareCodeSampleVariant(codeFragment);

    await kenticoCloudService.upsertVariantAsync(
        codeFragment.codename,
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
    addCodeSampleAsync,
    updateCodeSampleAsync,
    archiveCodeSampleAsync,
};
