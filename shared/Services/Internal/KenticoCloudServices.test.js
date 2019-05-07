const {
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    prepareVariantForUpsertAsyncFactory,
    addItemAsyncFactory,
    upsertVariantAsyncFactory,
} = require('./KenticoCloudServices');

describe('KenticoCloudServices', () => {
    const codename = 'test_codename';

    const item = {
        codename,
    };

    const variant = {
        code: 'test code',
    };

    describe('addItemAsyncFactory', () => {
        it('should do nothing if item exists.', async () => {
            const mockClient = {
                viewItemAsync: (codename) => ({ codename }),
                addItemAsync: jest.fn(),
            };

            await addItemAsyncFactory(mockClient)(codename, item);

            expect(mockClient.addItemAsync).not.toHaveBeenCalledWith();
        });

        it('should create new item if item does not exist.', async () => {
            const mockClient = {
                viewItemAsync: () => null,
                addItemAsync: jest.fn(),
            };

            await addItemAsyncFactory(mockClient)(codename, item);

            expect(mockClient.addItemAsync).toHaveBeenCalledWith(item);
        });
    });

    describe('upsertVariantAsyncFactory', () => {
        it('should update variant if it exists.', async () => {
            const mockClient = {
                viewVariantAsync: (codename) => ({ codename }),
                upsertVariantAsync: jest.fn(),
            };
            const mockDependencies = {
                kenticoCloudClient: mockClient,
                prepareVariantForUpsertAsync: jest.fn(),
            };

            await upsertVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).not.toHaveBeenCalledWith();
            expect(mockDependencies.prepareVariantForUpsertAsync).toHaveBeenCalledWith(codename);
        });

        it('should create new variant if it does not exist.', async () => {
            const mockClient = {
                viewVariantAsync: () => null,
                upsertVariantAsync: jest.fn(),
            };
            const mockDependencies = {
                kenticoCloudClient: mockClient,
                prepareVariantForUpsertAsync: jest.fn(),
            };

            await upsertVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).toHaveBeenCalledWith(codename, variant);
            expect(mockDependencies.prepareVariantForUpsertAsync).not.toHaveBeenCalledWith();
        });
    });

    describe('archiveItemVariantAsyncFactory', () => {
        it('should archive item.', async () => {
            const mockClient = {
                archiveVariantAsync: jest.fn(),
                viewItemAsync: (codename) => ({ codename }),
            };
            const mockDependencies = {
                unpublishVariantAsync: jest.fn(),
                kenticoCloudClient: mockClient,
            };

            await archiveItemVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.archiveVariantAsync).toHaveBeenCalledWith(codename);
            expect(mockDependencies.unpublishVariantAsync).toHaveBeenCalledWith(codename);
        });

        it('should do nothing if item does not exist.', async () => {
            const mockClient = {
                archiveVariantAsync: jest.fn(),
                viewItemAsync: () => null,
            };
            const mockDependencies = {
                unpublishVariantAsync: jest.fn(),
                kenticoCloudClient: mockClient,
            };

            await archiveItemVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.archiveVariantAsync).not.toHaveBeenCalled();
            expect(mockDependencies.unpublishVariantAsync).not.toHaveBeenCalled();
        });
    });

    describe('unpublishVariantAsyncFactory', () => {
        it('should unpublish published item.', async () => {
            const mockClient = {
                unpublishVariantAsync: jest.fn(),
            };
            const mockDependencies = {
                kenticoCloudClient: mockClient,
                isVariantPublishedAsync: () => true,
            };

            await unpublishVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.unpublishVariantAsync).toHaveBeenCalledWith(codename);
        });

        it('should do nothing if variant is not published.', async () => {
            const mockClient = {
                unpublishVariantAsync: jest.fn(),
            };
            const mockDependencies = {
                kenticoCloudClient: mockClient,
                isVariantPublishedAsync: () => false,
            };

            await unpublishVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.unpublishVariantAsync).not.toHaveBeenCalled();
        });
    });

    describe('prepareVariantForUpsertAsyncFactory', () => {
        it('should create new version of published variant.', async () => {
            const mockClient = {
                createNewVersionAsync: jest.fn(),
            };
            const mockDependencies = {
                kenticoCloudClient: mockClient,
                isVariantPublishedAsync: () => true,
                isVariantArchivedAsync: () => false,
            };

            await prepareVariantForUpsertAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.createNewVersionAsync).toHaveBeenCalledWith(codename);
        });

        it('should change archived variant to copywriting step.', async () => {
            const mockClient = {
                changeVariantWorkflowStepToCopywritingAsync: jest.fn(),
            };
            const mockDependencies = {
                kenticoCloudClient: mockClient,
                isVariantPublishedAsync: () => false,
                isVariantArchivedAsync: () => true,
            };

            await prepareVariantForUpsertAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.changeVariantWorkflowStepToCopywritingAsync).toHaveBeenCalledWith(codename);
        });
    });
});
