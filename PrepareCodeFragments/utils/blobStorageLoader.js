const { configuration } = require('../../shared/external/configuration');
const azure = require('azure-storage');

async function loadDataFromBlobStorage(url) {
    const blobService = azure.createBlobService(
        configuration.azureStorageAccount,
        configuration.azureStorageAccessKey
    );

    const data = await readBlob(blobService, parseBlobUrl(url));

    return JSON.parse(data);
}

function parseBlobUrl(blobUrl) {
    const url = new URL(blobUrl);
    const pathname = url.pathname.substring(1, url.pathname.length);
    const delimiterOfContainerAndBlob = pathname.indexOf('/');

    return {
        container: pathname.substring(0, delimiterOfContainerAndBlob),
        blob: pathname.substring(delimiterOfContainerAndBlob + 1, pathname.length),
    };
}

function readBlob(blobService, parsedUrl) {
    return new Promise((resolve, reject) => getBlobToText(resolve, reject)(blobService, parsedUrl));
}

function getBlobToText(resolve, reject) {
    return function (blobService, parsedUrl) {
        return blobService.getBlobToText(
            parsedUrl.container,
            parsedUrl.blob,
            (error, data) => handleError(resolve, reject)(error, data),
        );
    }
}

function handleError(resolve, reject) {
    return function (error, data) {
        if (error) {
            reject(error);
        }

        resolve(data);
    }
}

module.exports = {
    loadDataFromBlobStorage,
    parseBlobUrl,
};
