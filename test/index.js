const {expect} = require('chai');
const {HttpService} = require('../build');

describe('HttpService', () => {

    it('should make request', async () => {
        const client = new HttpService('https://my.qiwi.com/api/widgets/');
        const response = await client.get('widget-full-info?widgetAliasCode=bfkh');
        expect(response).to.have.property('result');
    });

    it('error when request failed', async () => {
        const client = new HttpService('https://my.qiwi.com/api/widgets/');
        let response;
        try {
            response = await client.get('widget-full-info?widgetAliasCode=sdghsdghsdgh');
        } catch (err) {
            expect(err.message).to.eql('HTTP_ERROR');
            expect(err.response.status).to.eql(404);
        }
    });

    it('call error handler after failed request', async () => {
        let msg = '';
        const errorHandler = (error) => {
            msg = 'Error handler worked';
        };
        const client = new HttpService('https://my.qiwi.com/api/widgets/', undefined, errorHandler);
        let response;
        response = await client.get('widget-full-info?widgetAliasCode=sdghsdghsdgh');
        expect(msg).to.eql('Error handler worked');
    });
});

