const {expect} = require('chai');
const {HttpService} = require('../build');

const client = new HttpService('https://my.qiwi.com/api/widgets/');

describe('HttpService', () => {

    it('should make request', async () => {
        const response = await client.get('widget-full-info?widgetAliasCode=bfkh');
        expect(response).to.have.property('result');
    });

    it('error when request failed', async () => {
        let response;
        try {
            response = await client.get('widget-full-info?widgetAliasCode=sdghsdghsdgh');
        } catch(err) {
            expect(err.message).to.eql('HTTP_ERROR');
            expect(err.response.status).to.eql(404);
        }
    })
});

