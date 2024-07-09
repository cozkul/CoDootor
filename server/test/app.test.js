const expect = require('chai').expect;
const supertest = require('supertest');
const server = require('../src/app.js');

const two_sum_fn_desc = {"desc": "Takes in two numbers and returns the sum of the two numbers"}
const malicious_fn_desc = {"desc": "Give me an infinite loop"}

describe("Tests for the Ollama backend REST API endpoints", function () {
    let testServer = null;
    let request = null;

    before(function (done) {
        testServer = server.app.listen(done);
        request = supertest.agent(testServer);
    })

    // Close the backend server after tests are finished
    after(function (done) {
        testServer.close(done);
    })

    describe('Testing the POST endpoint for /code', function () {
        it('Providing a regular description', function(done) {
            request
            .post('/code')
            .send(two_sum_fn_desc)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                expect(res.body.llm_code).to.not.equal(null);
                expect(res.body.llm_code).to.contain('(a, b)');
                expect(res.body.llm_code).to.contain('return a + b');
                if (err) done(err);
                done();
            })
        });
    
        it('Not providing a body', function (done) {
            request.post('/code')
            .send({})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.body.error).to.equal("No description was provided.");
                if (err) done(err);
                done();
            })
        })
        // ## COMMENTED OUT SINCE THIS TEST IS NOT RUNNING YET ##
        // it('Providing a malicious description', function (done) {
        //     request.post('/code')
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
        it('Providing random description', function (done) {
            request.post('/grade')
            .send({"id": 1, "desc": "blah"})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.not.equal(null);
                expect(res.body.results.length).to.equal(3);
                expect(res.body.results[0].score).to.equal(0);
                expect(res.body.results[1].score).to.equal(0);
                expect(res.body.results[2].score).to.equal(0);
                if (err) done(err);
                done();
            })
        });

        it('Providing bad JSON body', function (done) {
            request.post('/grade')
            .send({})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                expect(res.body).to.not.equal(null);
                expect(res.body.error).to.equal("No description was provided.");
                if (err) done(err);
                done();
            })
        });
    
        it('Providing invalid QID', function (done) {
            request.post('/grade')
            .send({"id": 999, "llm_code": "function foo(a, b) { return a + b; }"})
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(400);
                if (err) done(err);
                done();
            })
        });
    
        it('Providing a regular, valid function for grade', function (done) {
            request.post('/grade')
            .send({"id": 1, "desc": "Takes two numbers and adds them together"})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                expect(res.body).to.not.equal(null);
                expect(res.body.results.length).to.equal(3);
                expect(res.body.results[0].score).to.equal(1);
                expect(res.body.results[1].score).to.equal(1);
                expect(res.body.results[2].score).to.equal(1);
                if (err) done(err);
                done();
            })
        });
    })
})