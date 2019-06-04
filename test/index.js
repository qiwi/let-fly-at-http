const {expect, assert} = require('chai');
const {HttpService, HttpTimeoutError, HttpResponseError} = require('../build');

const client = new HttpService('https://my.qiwi.com/api/widgets/');
describe('HttpService', () => {

    it('should make request', async() => {
        const response = await client.get('widget-full-info', {widgetAliasCode: 'bfkh'});
        expect(response).to.have.property('result');
    });

    it('error when request failed', (done) => {
        client.get('widget-full-info', {widgetAliasCode: 'eutfweufwsdhoewufgwietf'})
            .then(() => {
                done(new Error('no error was thrown'));
            })
            .catch((err) => {
                expect(err.message).to.eql(HttpResponseError.ERROR_CODE);
                done();
            })
            .catch(err => done(err));
    });

    it('error when request failed is not raw Response', (done) => {
        client.get('widget-full-info', {widgetAliasCode: 'eutfweufwsdhoewufgwietf'})
            .then(() => {
                done(new Error('no error was thrown'));
            })
            .catch((err) => {
                expect(err._response instanceof Response).to.eql(false);
                done();
            })
            .catch(err => done(err));
    });

    it('timeout error works', (done) => {
        const fastClient = new HttpService('https://my.qiwi.com/api/widgets/', {}, 10);
        fastClient.get('widget-full-info', {widgetAliasCode: 'bfkh'})
            .then(() => {
                done(new Error('no error was thrown'));
            })
            .catch((err) => {
                expect(err.message).to.eql(HttpTimeoutError.ERROR_CODE);
                done();
            })
            .catch(err => done(err));
    })
});

