const {
    LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE,
    ITEM_NOT_FOUND_ERROR_CODE
} = require('../../utils/constants');
const {
    viewItemAsyncFactory,
    viewVariantAsyncFactory,
    archiveItemVariantAsyncFactory,
    unpublishVariantAsyncFactory,
    updateVariantAsyncFactory,
    addItemAsyncFactory,
    upsertVariantAsyncFactory,
} = require('./KenticoCloudServices');

describe('KenticoCloudServices', () => {
    const codename = 'test_codename';

    const item = {
        codename
    };

    const variant = {
        code: 'test code',
    };

    describe('addItemAsyncFactory', () => {
        it('should do nothing if item exists.', async () => {
            const mockDependencies = {
                viewItemAsync: (codename) => ({ codename }),
                kenticoCloudClient: {
                    addItemAsync: jest.fn(),
                }
            };

            await addItemAsyncFactory(mockDependencies)(codename, item);

            expect(mockDependencies.kenticoCloudClient.addItemAsync).not.toHaveBeenCalledWith();
        });

        it('should create new item if item does not exist.', async () => {
            const mockDependencies = {
                viewItemAsync: () => null,
                kenticoCloudClient: {
                    addItemAsync: jest.fn(),
                }
            };

            await addItemAsyncFactory(mockDependencies)(codename, item);

            expect(mockDependencies.kenticoCloudClient.addItemAsync).toHaveBeenCalledWith(item);
        });
    });

    describe('upsertVariantAsyncFactory', () => {
        it('should update variant if it exists.', async () => {
            const mockDependencies = {
                viewVariantAsync: (codename) => ({ codename }),
                updateVariantAsync: jest.fn(),
                kenticoCloudClient: {
                    upsertVariantAsync: jest.fn(),
                }
            };

            await upsertVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).not.toHaveBeenCalledWith();
            expect(mockDependencies.updateVariantAsync).toHaveBeenCalledWith(codename, variant);
        });

        it('should create new variant if it does not exist.', async () => {
            const mockDependencies = {
                viewVariantAsync: () => null,
                updateVariantAsync: jest.fn(),
                kenticoCloudClient: {
                    upsertVariantAsync: jest.fn(),
                }
            };

            await upsertVariantAsyncFactory(mockDependencies)(codename, variant);

            expect(mockDependencies.kenticoCloudClient.upsertVariantAsync).toHaveBeenCalledWith(codename, variant);
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
            error.errorCode = ITEM_NOT_FOUND_ERROR_CODE;

            const mockKenticoClient = {
                viewItemAsync: () => {
                    throw error
                },
            };

            const actualItem = await viewItemAsyncFactory({ kenticoCloudClient: mockKenticoClient })(codename);

            expect(actualItem).toEqual(expectedItem);
        });
    });

    describe('viewVariantAsyncFactory', () => {
        it('should return correct variant.', async () => {
            const expectedItem = {
                codename: codename,
            };

            const mockKenticoClient = {
                viewVariantAsync: (codename) => ({ codename }),
            };

            const actualItem = await viewVariantAsyncFactory({ kenticoCloudClient: mockKenticoClient })(codename);

            expect(actualItem).toEqual(expectedItem);
        });

        it('should return null if variant does not exist.', async () => {
            const expectedItem = null;
            const error = new Error('Variant not found!');
            error.errorCode = LANGUAGE_VARIANT_NOT_FOUND_ERROR_CODE;

            const mockKenticoClient = {
                viewVariantAsync: () => {
                    throw error
                },
            };

            const actualItem = await viewVariantAsyncFactory({ kenticoCloudClient: mockKenticoClient })(codename);

            expect(actualItem).toEqual(expectedItem);
        });
    });
});
