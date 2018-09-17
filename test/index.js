const {expect} = require('chai');
const {HttpService, HttpTimeoutError, HttpResponseError} = require('../build');

const client = new HttpService('https://my.qiwi.com/api/widgets/');
describe('HttpService', () => {

    it('should make request', async () => {
        const response = await client.get('widget-full-info?widgetAliasCode=bfkh');
        expect(response).to.have.property('result');
    });

    it('error when request failed', async () => {
        try {
            await client.get('widget-full-info?widgetAliasCode=sdghsdghsdgh');
        } catch(err) {
            expect(err.message).to.eql(HttpResponseError.ERROR_CODE);
        }
    });

    it('timeout error works', async () => {
        const fastClient = new HttpService('https://my.qiwi.com/api/widgets/', {}, 10);
        try {
            await fastClient.get('widget-full-info?widgetAliasCode=bfkh');
        } catch(err) {
            expect(err.message).to.eql(HttpTimeoutError.ERROR_CODE);
        }
    })
});

