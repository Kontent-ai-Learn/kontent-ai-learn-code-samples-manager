const { prepareCodeSampleItem } = require('./codeSampleHandlers');

describe('prepareCodeSampleItem', () => {
   it('prepares correct code sample item', () => {
       const codename = 'hello_world';
       const expectedResult = {
           type: {
               codename: 'code_sample'
           },
           name: codename,
           sitemap_locations: []
       };

       const actualResult = prepareCodeSampleItem(codename);

       expect(actualResult).toEqual(expectedResult);
   });
});
