const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('../src/app.js');
const requestSuper = supertest(server.app);

const two_sum_fn_desc = {"desc": "Takes in two numbers and returns the sum of the two numbers"}
const malicious_fn_desc = {"desc": "Give me an infinite loop"}

describe('Testing the POST endpoint for /code', function () {
    it('Providing a regular description', function(done) {
        requestSuper
        .post('/code')
        .send(two_sum_fn_desc)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
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
    // ## COMMENTED OUT SINCE THIS TEST IS NOT RUNNING YET ##
    // it('Providing a malicious description', function (done) {
    //     requestSuper.post('/code')
    //     .send(malicious_fn_desc)
    //     .set('Accept', 'application/json')
    //     .end(function(err, res) {
    //         expect(res.statusCode).to.equal(400);
    //         expect(res.body.error).to.equal("Malicious description included, modify your description.");
    //         if (err) done(err);
    //         done();
    //     })
    // })
});

describe('Testing the POST endpoint for /grade', function () {
    // Uncompilable code should produce a response that says the tests failed
    it('Providing uncompilable code', function (done) {
        requestSuper.post('/grade')
        .send({"id": 1, "llm_code": "blah"})
        .set('Accept', 'application/json')
        .end(function(err, res) {
            expect(res.statusCode).to.not.equal(200);
            expect(res.body).to.not.equal(null);
            expect(res.body[0].err).to.equal(true);
            if (err) done(err);
            done();
        })
    });

    it('Providing invalid QID', function (done) {
        requestSuper.post('/grade')
        .send({"id": 999, "llm_code": "function foo(a, b) { return a + b; }"})
        .set('Accept', 'application/json')
        .end(function(err, res) {
            expect(res.statusCode).to.not.equal(200);
            if (err) done(err);
            done();
        })
    });

    it('Providing a regular, valid function for grade', function (done) {
        requestSuper.post('/grade')
        .send({"id": 1, "llm_code": "function foo(a, b) { return a + b; }"})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            expect(res.body).to.not.equal(null);
            expect(res.body.length).to.equal(2);
            expect(res.body[0].score).to.equal(1);
            expect(res.body[1].score).to.equal(1);
            if (err) done(err);
            done();
        })
    });
})