const { loadDataFromBlobStorage } = require('./utils/blobStorageLoader');

module.exports = async function (context) {
    const url = context.bindingData.blobStorageUrl;

    return loadDataFromBlobStorage(url);
};
