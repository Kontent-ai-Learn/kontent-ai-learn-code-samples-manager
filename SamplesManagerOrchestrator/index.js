const df = require('durable-functions');

module.exports = df.orchestrator(function * (context) {
    const CHUNK_SIZE = 2;

    const codeFragments = [
        {
            status: 'added',
            code: 'console.log',
            programmingLanguage: 'java',
            platform: 'java',
            codename: 'published_java'
        },
        {
            status: 'added',
            code: 'console.log',
            programmingLanguage: 'javascript',
            platform: 'javascript',
            codename: 'published_js'
        },
        {
            status: 'added',
            code: 'console.log(alone)',
            programmingLanguage: 'javascript',
            platform: 'javascript',
            codename: 'published_alone_js'
        },
        {
            status: 'deleted',
            code: 'console.log',
            programmingLanguage: 'java',
            platform: 'java',
            codename: 'published_java'
        },
        {
            status: 'deleted',
            code: 'console.log',
            programmingLanguage: 'java',
            platform: 'java',
            codename: 'published_alone_js'
        },
        {
            status: 'deleted',
            code: 'console.log',
            programmingLanguage: 'javascript',
            platform: 'javascript',
            codename: 'published_js'
        },
        {
            status: 'added',
            code: 'console.log(alone)',
            programmingLanguage: 'javascript',
            platform: 'javascript',
            codename: 'published_alone_js'
        },
        {
            status: 'modified',
            code: 'console.log(alone new modified)',
            programmingLanguage: 'javascript',
            platform: 'javascript',
            codename: 'published_alone_js'
        }
    ];

    for (let i = 0; i < codeFragments.length; i = i + CHUNK_SIZE) {
        const codeFragmentsChunk = codeFragments.slice(i, i + CHUNK_SIZE);

        yield context.df.callActivity('CodeSampleManager', codeFragmentsChunk);
        yield context.df.callActivity('CodeSamplesManager', codeFragmentsChunk);
    }
});
