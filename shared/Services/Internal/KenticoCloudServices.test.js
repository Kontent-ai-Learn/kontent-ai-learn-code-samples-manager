const { LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE } = require('../../utils/constants');
const {
    viewItemAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    createItemVariantAsyncFactory,
    updateVariantAsyncFactory,
    upsertItemVariantAsyncFactory,
} = require('./KenticoCloudServices');

describe('KenticoCloudServices', () => {
    const codename = 'test_codename';

    const item = {
        codename
    };

    const variant = {
        code: 'test code',
    };

    describe('upsertItemVariantAsyncFactory', () => {
        it('should update item variant if it exists.', async () => {
            const mockDependencies = {
                viewItemAsync: (codename) => ({ codename }),
                updateVariantAsync: jest.fn(),
                createItemVariantAsync: jest.fn(),
            };

            await upsertItemVariantAsyncFactory(mockDependencies)(codename, item, variant);

            expect(mockDependencies.updateVariantAsync).toHaveBeenCalledWith(codename, variant);
            expect(mockDependencies.createItemVariantAsync).not.toHaveBeenCalledWith();
        });

        it('should create new item if it does not exist.', async () => {
            const mockDependencies = {
                viewItemAsync: () => null,
                updateVariantAsync: jest.fn(),
                createItemVariantAsync: jest.fn(),
            };

            await upsertItemVariantAsyncFactory(mockDependencies)(codename, item, variant);

            expect(mockDependencies.createItemVariantAsync).toHaveBeenCalledWith(codename, item, variant);
            expect(mockDependencies.updateVariantAsync).not.toHaveBeenCalledWith();
        });
    });

    describe('archiveItemVariantAsyncFactory', () => {
        it('should archive item.', async () => {
            const mockDependencies = {
                viewItemAsync: (codename) => ({ codename }),
                unpublishVariantAsync: jest.fn(),
                kenticoCloudClient: {
                    archiveVariantAsync: jest.fn(),
                },
            };

            await archiveItemVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.archiveVariantAsync).toHaveBeenCalledWith(codename);
            expect(mockDependencies.unpublishVariantAsync).toHaveBeenCalledWith(codename);
        });

        it('should do nothing if item does not exist.', async () => {
            const mockDependencies = {
                viewItemAsync: () => null,
                unpublishVariantAsync: jest.fn(),
                kenticoCloudClient: {
                    archiveVariantAsync: jest.fn(),
                },
            };

            await archiveItemVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.archiveVariantAsync).not.toHaveBeenCalled();
            expect(mockDependencies.unpublishVariantAsync).not.toHaveBeenCalled();
        });
    });

    describe('unpublishVariantAsyncFactory', () => {
        it('should unpublish published item.', async () => {
            const mockDependencies = {
                isVariantPublishedAsync: () => true,
                kenticoCloudClient: {
                    unpublishVariantAsync: jest.fn(),
                },
            };

            await unpublishVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.unpublishVariantAsync).toHaveBeenCalledWith(codename);
        });

        it('should do nothing if variant is not published.', async () => {
            const mockDependencies = {
                isVariantPublishedAsync: () => false,
                kenticoCloudClient: {
                    unpublishVariantAsync: jest.fn(),
                },
            };

            await unpublishVariantAsyncFactory(mockDependencies)(codename);

            expect(mockDependencies.kenticoCloudClient.unpublishVariantAsync).not.toHaveBeenCalled();
        });
    });

    describe('createItemVariantAsyncFactory', () => {
        it('should create item and variant.', async () => {
            const mockDependencies = {
                kenticoCloudClient: {
                    addItemAsync: jest.fn(),
                    upsertVariantAsync: jest.fn(),
                },
            };

            await createItemVariantAsyncFactory(mockDependencies)(item.codename, item, variant);

            expect(mockDependencies.kenticoCloudClient.addItemAsync).toHaveBeenCalledWith(item);
            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).toHaveBeenCalledWith(item.codename, variant);
        });
    });

    describe('updateVariantAsyncFactory', () => {
        it('should update variant which is not published nor archived.', async () => {
            const mockDependencies = {
                isVariantPublishedAsync: () => false,
                isVariantArchivedAsync: () => false,
                kenticoCloudClient: {
                    upsertVariantAsync: jest.fn(),
                },
            };

            await updateVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).toHaveBeenCalledWith(codename, variant);
        });

        it('should create new version of published variant and update it.', async () => {
            const mockDependencies = {
                isVariantPublishedAsync: () => true,
                isVariantArchivedAsync: () => false,
                kenticoCloudClient: {
                    createNewVersionAsync: jest.fn(),
                    upsertVariantAsync: jest.fn(),
                },
            };

            await updateVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).toHaveBeenCalledWith(codename, variant);
            expect(mockDependencies.kenticoCloudClient.createNewVersionAsync).toHaveBeenCalledWith(codename);
        });

        it('should change archived variant to copywriting step and update it.', async () => {
            const mockDependencies = {
                isVariantPublishedAsync: () => false,
                isVariantArchivedAsync: () => true,
                kenticoCloudClient: {
                    changeVariantWorkflowStepToCopywritingAsync: jest.fn(),
                    upsertVariantAsync: jest.fn(),
                },
            };

            await updateVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).toHaveBeenCalledWith(codename, variant);
            expect(mockDependencies.kenticoCloudClient.changeVariantWorkflowStepToCopywritingAsync).toHaveBeenCalledWith(codename);
        });
    });

    describe('viewItemAsyncFactory', () => {
        it('should return correct item.', async () => {
            const expectedItem = {
                codename: codename,
            };

            const mockKenticoClient = {
                viewItemAsync: (codename) => ({ codename }),
            };

            const actualItem = await viewItemAsyncFactory({ kenticoCloudClient: mockKenticoClient })(codename);

            expect(actualItem).toEqual(expectedItem);
        });

        it('should return null if item does not exist.', async () => {
            const expectedItem = null;
            const error = new Error('Item not found!');
            error.errorCode = LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE;

            const mockKenticoClient = {
                viewItemAsync: () => {
                    throw error
                },
            };

            const actualItem = await viewItemAsyncFactory({ kenticoCloudClient: mockKenticoClient })(codename);

            expect(actualItem).toEqual(expectedItem);
        });
    });
});
