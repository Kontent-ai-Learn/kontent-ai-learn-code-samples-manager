const Configuration = require('../shared/external/configuration');
const { loadDataFromBlobStorage } = require('./utils/blobStorageLoader');
const { getGroupedBy } = require('../shared/utils/getGroupedBy');

module.exports = async function (context) {
    await Configuration.setupAzureStorage();
    const url = context.bindingData.blobStorageUrl;
    const loadedData = await loadDataFromBlobStorage(url);

    return {
        mode: loadedData.mode,
        codeFragments: getGroupedBy(loadedData.codeFragments, 'identifier'),
    };
};
