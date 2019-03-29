const df = require('durable-functions');

module.exports = df.orchestrator(function * (context) {
    const output = [];

    output.push(yield context.df.callActivity('CodeSampleManager', [{
        status: 'deleted',
        code: 'console.log',
        programmingLanguage: 'java',
        platform: 'java',
        codename: 'published'
    }]));
    output.push(yield context.df.callActivity('CodeSamplesManager'));

    return output;
});
