const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('../src/app.js');
const requestSuper = supertest(server.app);

const two_sum_fn_desc = {"desc": "Takes in two numbers and returns the sum of the two numbers"}

describe('Testing the POST endpoint for /code', function () {
    it('Providing a regular description', function(done) {
        requestSuper
        .post('/code')
        .send(two_sum_fn_desc)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            console.log(res);
            expect(res.body.llm_code).to.not.equal(null);
            expect(res.body.llm_code).to.contain('function (a, b)');
            expect(res.body.llm_code).to.contain('return a + b');
            if (err) done(err);
            done();
        })
    });

    it('Not providing a body', function (done) {
        requestSuper.post('/code')
        .send({})
        .set('Accept', 'application/json')
        .end(function(err, res) {
            expect(res.statusCode).to.not.equal(200);
            if (err) done(err);
            done();
        })
    })
});

