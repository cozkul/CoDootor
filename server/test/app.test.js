const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('../src/app.js');
const requestSuper = supertest(server.app);

describe('Testing the POST endpoint for /code', function () {
    it('Providing a regular description', async () => {
        const res = await requestSuper.post('/code');
        expect(res.status).to.equal(200);
        expect(res.type).to.contain('json');
        const body = res.body;

        expect(body).to.contain('function (a, b)');
        expect(body).to.contain('return a + b');
    });

    it('Not providing a body', async () => {
        const resp = await fetch(getCodeEndpoint, {
            method: "POST"
        }).then(resp => {
            expect(resp.ok).to.equal(false);
        }).catch(error => {
            expect.fail(error);
        })
    })
});