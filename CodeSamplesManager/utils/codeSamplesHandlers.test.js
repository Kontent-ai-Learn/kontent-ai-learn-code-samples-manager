const { updateCodeSamplesItemAsyncFactory } = require('./codeSamplesHandlers');

describe('CodeSamplesHandlers', () => {
    describe('updateCodeSamplesItemAsync', () => {
        it('archive code samples if all linked code sample items are archived.', async () => {
            const codename = 'test';
            const mockDependencies = {
                getCodeSampleInfoAsync: () => [
                    { Status: { '_': 'archived' }, RowKey: { '_': `${codename}_rest` } },
                    { Status: { '_': 'archived' }, RowKey: { '_': `${codename}_net` } },
                    { Status: { '_': 'archived' }, RowKey: { '_': `${codename}_java` } },
                ],
                upsertCodeSamplesItemAsync: jest.fn(),
                archiveItemVariantAsync: jest.fn(),
            };

            await updateCodeSamplesItemAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.archiveItemVariantAsync).toHaveBeenCalledWith(codename);
            expect(mockDependencies.upsertCodeSamplesItemAsync).not.toHaveBeenCalledWith();
        });

        it('update code samples when one code sample is not archived.', async () => {
            const codename = 'test';
            const linkedCodeSampleItems = [
                `${codename}_rest`,
                `${codename}_net`,
                `${codename}_java`,
            ];
            const mockDependencies = {
                getCodeSampleInfoAsync: () => [
                    { Status: { '_': 'active' }, RowKey: { '_': `${codename}_rest` } },
                    { Status: { '_': 'archived' }, RowKey: { '_': `${codename}_net` } },
                    { Status: { '_': 'archived' }, RowKey: { '_': `${codename}_java` } },
                ],
                upsertCodeSamplesItemAsync: jest.fn(),
                archiveItemVariantAsync: jest.fn(),
            };

            await updateCodeSamplesItemAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.archiveItemVariantAsync).not.toHaveBeenCalledWith();
            expect(mockDependencies.upsertCodeSamplesItemAsync).toHaveBeenCalledWith(codename, linkedCodeSampleItems);
        });

        it('update code samples when one code sample is archived.', async () => {
            const codename = 'test';
            const linkedCodeSampleItems = [
                `${codename}_rest`,
                `${codename}_net`,
                `${codename}_java`,
            ];
            const mockDependencies = {
                getCodeSampleInfoAsync: () => [
                    { Status: { '_': 'active' }, RowKey: { '_': `${codename}_rest` } },
                    { Status: { '_': 'active' }, RowKey: { '_': `${codename}_net` } },
                    { Status: { '_': 'archived' }, RowKey: { '_': `${codename}_java` } },
                ],
                upsertCodeSamplesItemAsync: jest.fn(),
                archiveItemVariantAsync: jest.fn(),
            };

            await updateCodeSamplesItemAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.archiveItemVariantAsync).not.toHaveBeenCalledWith();
            expect(mockDependencies.upsertCodeSamplesItemAsync).toHaveBeenCalledWith(codename, linkedCodeSampleItems);
        });
    });
});
