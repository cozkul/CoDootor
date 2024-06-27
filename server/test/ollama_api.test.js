const expect = require('chai').expect;
const oa = require('../src/ollama_api.js');

const two_sum_fn_desc = {"desc": "Takes in two numbers and returns the sum of the two numbers"}
const llm_two_sum_response = "Here is the JavaScript function `foo`:\
\
```\
function foo(a, b) {\
  return a + b;\
}\
```"

describe('Testing the ParseResponse function', function () {
    it('Regular response from LLM', function () {
        const resp = oa.ParseLLMResponse(llm_two_sum_response);
        expect(resp).to.contain('function foo(a, b');
        expect(resp).to.not.contain("```");
        expect(resp).to.contain('return a + b');
    });

    it('Parsing error response from LLM', function () {
        const resp = oa.ParseLLMResponse(null);
        expect(resp).to.equal(null);
    });

    it('Parsing undefined', function () {
        const resp = oa.ParseLLMResponse();
        expect(resp).to.equal(null);
    });
});

describe('Testing the FetchResponse function', function () {
    it('Fetching response for regular query', async () => {
        const resp = await oa.FetchResponse(two_sum_fn_desc);
        expect(resp).to.not.equal(null);
        expect(resp.llm_code).to.contain("function");
        expect(resp.llm_code).to.contain("(a, b)");
        expect(resp.llm_code).to.contain("return a + b");
    });

    it('Fetching response for random query', async () => {
        const resp = await oa.FetchResponse({"desc": "blah"})
        expect(resp).to.equal(null);
    });

    it('Fetching response for null query', async () => {
        const resp = await oa.FetchResponse(null);
        expect(resp).to.equal(null);
    });

    it('Fetching response for invalid JSON query', async () => {
        const resp = await oa.FetchResponse({});
        expect(resp).to.equal(null);
    });

    it('Fetching response for missing desc query', async () => {
        const resp = await oa.FetchResponse({"fn_code": ""});
        expect(resp).to.equal(null);
    });

    it('Fetching response for misnamed desc query', async () => {
        const resp = await oa.FetchResponse({"fn_desc": ""});
        expect(resp).to.equal(null);
    });

    it('Fetching response with no function arguments', async () => {
        const resp = await oa.FetchResponse();
        expect(resp).to.equal(null);
    })
});

describe('Testing the TestGeneratedCode function', function () {
    it('Testing a correctly generated LLM function for Q1', function () {
        const res = oa.TestGeneratedCode({
            "llm_code": "function foo(a, b) { return a + b }",
            "id": 1,
            "user": "deraphel" 
        })
        
        expect(res.length).to.equal(2);
        expect(res[0].desc).to.equal("A test to check if adding properly.");
        expect(res[0].score).to.equal(1);

        expect(res[1].desc).to.equal("A less basic test to check if adding properly.");
        expect(res[1].score).to.equal(1);
    });

    it('Testing an incorrectly generated LLM function for Q1', function () {
        const res = oa.TestGeneratedCode({
            "llm_code": "function foo() { return; }",
            "id": 1,
            "user": "deraphel" 
        })

        expect(res.length).to.equal(2);
        expect(res[0]).to.not.equal(null);
        expect(res[0].desc).to.equal("A test to check if adding properly.");
        expect(res[0].score).to.equal(0);

        expect(res[1].desc).to.equal("A less basic test to check if adding properly.");
        expect(res[1].score).to.equal(0);
    });

    it('Testing a broken function for Q1', function () {
        const res = oa.TestGeneratedCode({
            "llm_code": "function foo() { , }",
            "id": 1,
            "user": "deraphel" 
        })

        expect(res.length).to.equal(1);
        expect(res[0]).to.not.equal(null);
        expect(res[0].err).to.equal(true);
        expect(res[0].err_reason).to.contain("SyntaxError: Unexpected token \',\'");
    });

    it('Testing a function with missing parameters for Q1', function () {
        const res = oa.TestGeneratedCode({
            "llm_code": "function foo() { return a + b }",
            "id": 1,
            "user": "deraphel" 
        })

        expect(res.length).to.equal(1);
        expect(res[0]).to.not.equal(null);
        expect(res[0].err).to.equal(true);
        expect(res[0].err_reason).to.contain("a is not defined");
    });

    it('Testing improper JSON formats and undefined', function () {
        expect(oa.TestGeneratedCode({})).to.equal(null);
        expect(oa.TestGeneratedCode({"code": "hello"})).to.equal(null);
        expect(oa.TestGeneratedCode({"llm_code": "", "id": "one", "user": "derpahel"})).to.equal(null);
        expect(oa.TestGeneratedCode({"llm_code": "", "id": 1})).to.equal(null);
        expect(oa.TestGeneratedCode(null)).to.equal(null);
        expect(oa.TestGeneratedCode()).to.equal(null);
    });
})