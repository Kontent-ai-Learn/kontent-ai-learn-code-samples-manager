const kenticoCloudService = require('../../shared/Services/KenticoCloudService');

async function storeCodeSample(codeFragment) {
    const codeSampleItem = prepareCodeSampleItem(codeFragment.codename);
    const codeSampleVariantElements = prepareCodeSampleElements(codeFragment);

    await kenticoCloudService.createItemAsync(codeSampleItem, codeFragment.codename, codeSampleVariantElements);
}

async function archiveCodeSample(codename) {
    await kenticoCloudService.archiveItemVariantAsync(codename);
}

async function updateCodeSample(codeFragment) {
    const codeSampleItem = prepareCodeSampleItem(codeFragment.codename);
    const codeSampleVariantElements = prepareCodeSampleElements(codeFragment);

    await kenticoCloudService.updateItemAsync(codeSampleItem, codeFragment.codename, codeSampleVariantElements);
}

function prepareCodeSampleElements(codeFragment) {
    return [
        {
            element: {
                codename: "code"
            },
            value: codeFragment.code 
        },
        {
            element: {
                codename: "programming_language"
            },
            value: [ 
                { 
                    codename: codeFragment.programmingLanguage 
                } 
            ]
        },
        {
            element: {
                codename: "platform"
            },
            value: [ 
                { 
                    codename: codeFragment.platform 
                }
            ]
        }
    ];
}

function prepareCodeSampleItem(codename) {
    return {
        type: {
            codename: "code_sample"
        },
        name: codename,
        // Delete when CM API v2 update content item end-point will be fixed and sitemap_locations will not be required
        sitemap_locations: []
    };
}

module.exports = {
    storeCodeSample,
    archiveCodeSample,
    updateCodeSample
}
