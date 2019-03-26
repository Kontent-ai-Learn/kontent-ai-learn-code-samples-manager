const { setupConfiguration } = require('../shared/utils/configuration');
const {    
    storeCodeSample,
    archiveCodeSample,
    updateCodeSample
} = require('./utils/codeSampleHandlers');

module.exports = async function(context) {
    setupConfiguration();
    
    const codeFragments = context.bindingData.codeSamples;

    for (const codeFragment of codeFragments) {
        switch(codeFragment.status) {
            case "added": 
                storeCodeSample(codeFragment);
                break;

            case "modified":
                updateCodeSample(codeFragment);
                break;

            case "deleted":
                archiveCodeSample(codeFragment.codename);
                break;

            default:
                throw new Error("Unexpected value of the codeFragment status!")
        }
    };
};