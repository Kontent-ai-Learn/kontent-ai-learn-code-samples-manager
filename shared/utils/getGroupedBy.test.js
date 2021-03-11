const { getGroupedBy } = require('./getGroupedBy');

const firstCodeSampleItemOfGroup = {
    code: 'firstCodeSample',
    identifier: 'group',
    codename: 'group_js',
    status: 'added',
    programmingLanguage: 'js',
    platform: 'js',
};

const secondCodeSampleItemOfGroup = {
    code: 'firstCodeSample',
    identifier: 'group',
    codename: 'group_net',
    status: 'modified',
    programmingLanguage: 'net',
    platform: 'net',
};

const codeSampleItemOutOfGroup = {
    code: 'firstCodeSample',
    identifier: 'notGroup',
    codename: 'notGroup_js',
    status: 'added',
    programmingLanguage: 'js',
    platform: 'js',
};

describe('getGroupedBy', () => {
    it('should return correctly grouped code sample items', () => {
        const codeSamplesItems = [
            firstCodeSampleItemOfGroup,
            codeSampleItemOutOfGroup,
            secondCodeSampleItemOfGroup,
        ];

        const expectedResult = [
            [
                firstCodeSampleItemOfGroup,
                secondCodeSampleItemOfGroup,
            ],
            [
                codeSampleItemOutOfGroup
            ],
        ];

        const actualResult = getGroupedBy(codeSamplesItems, 'identifier');

        expect(actualResult).toEqual(expectedResult);
    });

    it('should return processed data if grouping is not required', () => {
        const codeSamplesItems = [
            firstCodeSampleItemOfGroup,
            codeSampleItemOutOfGroup,
        ];

        const expectedResult = [
            [
                firstCodeSampleItemOfGroup,
            ],
            [
                codeSampleItemOutOfGroup
            ],
        ];

        const actualResult = getGroupedBy(codeSamplesItems, 'identifier');

        expect(actualResult).toEqual(expectedResult);
    });
});
