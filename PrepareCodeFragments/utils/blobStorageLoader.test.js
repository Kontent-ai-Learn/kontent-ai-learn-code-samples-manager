const { parseBlobUrl } = require('./blobStorageLoader');

const testCases = [
    ['code-sample-fragments', '657e7077-1ee8-4d48-8c64-586f536ec233'],
    ['code-sample-fragments', 'test/657e7077-1ee8-4d48-8c64-586f536ec233'],
    ['code-sample-fragments', '2test'],
];

describe.each(testCases)(
    'parseBlobUrl with container name %s and blob name %s',
    (container, blob) => {
        test('should return correct name of container and blob', () => {
            const expectedResult = {
                container,
                blob,
            };

            const actualResult = parseBlobUrl(`https://kcddev.blob.core.windows.net/${container}/${blob}`);

            expect(actualResult).toEqual(expectedResult);
        });
    }
);
