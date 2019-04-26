const { setupAzureStorage } = require('../shared/external/configuration');
const { loadDataFromBlobStorage } = require('./utils/blobStorageLoader');
const { getGroupedBy } = require('../shared/utils/getGroupedBy');

module.exports = async function (context) {
    try {
        await setupAzureStorage();
        const url = context.bindingData.blobStorageUrl;
        const loadedData = await loadDataFromBlobStorage(url);

        return {
            mode: loadedData.mode,
            codeFragments: getGroupedBy(loadedData.codeFragments, 'identifier'),
        };
    } catch (error) {
        /** This try-catch is required for correct logging of exceptions in Azure */
        throw `Message: ${error.message} \nStack Trace: ${error.stack}`;
    }
};
