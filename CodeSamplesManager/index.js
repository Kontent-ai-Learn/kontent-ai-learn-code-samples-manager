const { setupConfiguration } = require('../shared/utils/configuration');

module.exports = async function (context) {
    setupConfiguration();

    const codeSamplesList = context.bindingData.codeSamplesList; // eslint-disable-line no-unused-vars
};
