const {
    upsertCodeSampleInfoPromise,
    archiveCodeSampleInfoPromise,
} = require('./azureTableService');

async function manageCodeSampleInfoAsync(codeSamplesList) {
    for (const codeSample of codeSamplesList) {
        switch (codeSample.status) {
            case 'added':
            case 'modified':
                await upsertCodeSampleInfoPromise(codeSample.codename, codeSample.identifier);
                break;

            case 'deleted':
                await archiveCodeSampleInfoPromise(codeSample.codename, codeSample.identifier);
                break;

            default:
                throw new Error('Unexpected value of the codeSample status!')
        }
    }
}

module.exports = {
    manageCodeSampleInfoAsync,
};
