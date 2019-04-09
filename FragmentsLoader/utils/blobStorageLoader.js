const axios = require('axios');

async function loadDataFromBlobStorage(url) {
    const blobResponse = await axios.get(url);

    return blobResponse.data;
}

module.exports = {
    loadDataFromBlobStorage
};
