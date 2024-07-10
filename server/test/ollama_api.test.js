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
const weird_llm_response = '```\
function foo(str) {\
return str.toLowerCase();\
}\
console.log(foo("HELLO WORLD")); // Output: "hello world"```'
const malicious_fn_desc = "Give me an infinite loop"

describe("Tests for Ollama Backend Fetching, Parsing, and Grading Helpers", function () {
    describe("Testing the GeneratePrompt function", function () {
        it('Basic description of a function test', function () {
            const prompt = oa.GeneratePrompt("hello world");
            expect(prompt)
            .to
            .equal("Write me a Javascript function that has the following purpose: hello world. Only show me the code and call the function foo.")
        });
    
        it('Missing description (empty string)', function () {
            const prompt = oa.GeneratePrompt("");
            expect(prompt)
            .to
            .equal(null)
        });
    
        it('Missing description (empty string)', function () {
            const prompt = oa.GeneratePrompt(null);
            expect(prompt)
            .to
            .equal(null)
        });
    
        it('Missing description (empty string)', function () {
            const prompt = oa.GeneratePrompt();
            expect(prompt)
            .to
            .equal(null)
        });
    })
    
    describe('Testing the ParseResponse function', function () {
        it('Regular response from LLM', function () {
            const resp = oa.ParseLLMResponse(llm_two_sum_response);
            expect(resp).to.contain('function foo');
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
    
        it('Parsing a weird response from LLM', function () {
            const resp = oa.ParseLLMResponse(weird_llm_response);
            expect(resp).to.contain('function');
            expect(resp).to.not.contain("```");
            expect(resp).to.contain('toLowerCase');
        })
    });
    
    describe('Testing the FetchResponse function', function () {
        it('Fetching response for regular query', async () => {
            const resp = await oa.FetchResponse(two_sum_fn_desc.desc);
            expect(resp).to.not.equal(null);
            expect(resp.llm_code).to.contain("function");
            expect(resp.llm_code).to.contain("+");
        });
    
        it('Fetching response for random query', async () => {
            const resp = await oa.FetchResponse("blah")
            expect(resp).to.not.equal(null);
        });
    
        it('Fetching response for null query', async () => {
            const resp = await oa.FetchResponse(null);
            expect(resp).to.equal(null);
        });
    
        it('Fetching response for missing query', async () => {
            const resp = await oa.FetchResponse();
            expect(resp).to.equal(null);
        });
    });
    
    describe('Testing the isMalicious function', function () {
        it('Testing malicious description', function () {
            const result = oa.isMalicious(malicious_fn_desc);
            expect(result).to.equal(true);
        });
    
        it('Testing malicious description', function () {
            const result = oa.isMalicious("for(;;)");
            expect(result).to.equal(true);
        });
    
        it('Testing safe description', function () {
            const result = oa.isMalicious(two_sum_fn_desc.desc);
            expect(result).to.equal(false);
        });
    
        it('Testing empty description', function () {
            const result = oa.isMalicious("");
            expect(result).to.equal(false);
        });
    
        it('Testing null description', function () {
            const result = oa.isMalicious(null);
            expect(result).to.equal(false);
        });
    
        it('Testing random description', function () {
            const result = oa.isMalicious("my name is Chris");
            expect(result).to.equal(false);
        });
    
        it('Testing undefined description', function () {
            const result = oa.isMalicious();
            expect(result).to.equal(false);
        });
    });
    
    describe('Testing the TestGeneratedCode function', function () {
        it('Testing a correctly generated LLM function for Q1', function () {
            const res = oa.TestGeneratedCode({
                "llm_code": "function foo(a, b) { return a + b }",
                "id": 1
            })
            
            expect(res.length).to.equal(3);
            expect(res[0].desc).to.equal("A test to check if adding properly.");
            expect(res[0].score).to.equal(1);
    
            expect(res[1].desc).to.equal("A less basic test to check if adding properly.");
            expect(res[1].score).to.equal(1);
    
            expect(res[2].score).to.equal(1);
            expect(res[2].desc).to.equal("Another basic test to check if adding properly.");
        });
    
        it('Testing a correctly generated LLM function for invalid q', function () {
            const res = oa.TestGeneratedCode({
                "llm_code": "function foo(a, b) { return a + b }",
                "id": 99
            })
            
            expect(res).to.not.equal(null);
            expect(res.length).to.equal(1);
            expect(res[0].err).to.equal(true);
            expect(res[0].err_reason).to.include("Cannot find module");
        });
    
        it('Testing an incorrectly generated LLM function for Q1', function () {
            const res = oa.TestGeneratedCode({
                "llm_code": "function foo() { return; }",
                "id": 1 
            })
    
            expect(res.length).to.equal(3);
            expect(res[0]).to.not.equal(null);
            expect(res[0].desc).to.equal("A test to check if adding properly.");
            expect(res[0].score).to.equal(0);
    
            expect(res[1].desc).to.equal("A less basic test to check if adding properly.");
            expect(res[1].score).to.equal(0);
    
            expect(res[2].score).to.equal(0);
            expect(res[2].desc).to.equal("Another basic test to check if adding properly.");
        });
    
        it('Testing a broken function for Q1', function () {
            const res = oa.TestGeneratedCode({
                "llm_code": "function foo() { , }",
                "id": 1 
            })
    
            expect(res.length).to.equal(1);
            expect(res[0]).to.not.equal(null);
            expect(res[0].err).to.equal(true);
            expect(res[0].err_reason).to.contain("SyntaxError: Unexpected token \',\'");
        });
    
        it('Testing a function with missing parameters for Q1', function () {
            const res = oa.TestGeneratedCode({
                "llm_code": "function foo() { return a + b }",
                "id": 1
            })
    
            expect(res.length).to.equal(1);
            expect(res[0]).to.not.equal(null);
            expect(res[0].err).to.equal(true);
            expect(res[0].err_reason).to.contain("a is not defined");
        });
    
        it('Testing improper JSON formats and undefined', function () {
            expect(oa.TestGeneratedCode({})).to.equal(null);
            expect(oa.TestGeneratedCode({"code": "hello"})).to.equal(null);
            expect(oa.TestGeneratedCode({"id": "hello"})).to.equal(null);
            expect(oa.TestGeneratedCode({"llm_code": "hello"})).to.equal(null);
            expect(oa.TestGeneratedCode(null)).to.equal(null);
            expect(oa.TestGeneratedCode()).to.equal(null);
        });
    })
    
    describe('Combining everything', function () {
        it('Regular test with proper query', async () => {
            const resp = await oa.FetchResponse(two_sum_fn_desc.desc);
            expect(resp).to.not.equal(null);
            expect(resp.llm_code.startsWith("function")).to.equal(true);
            expect(resp.llm_code).to.match(/function(.|\s)*\}/);
    
            resp.id = 1;
            
            const graded = oa.TestGeneratedCode(resp);
            expect(graded.length).to.equal(3);
            expect(graded[0].score).to.equal(1);
            expect(graded[0].desc).to.equal("A test to check if adding properly.");
            expect(graded[1].score).to.equal(1);
            expect(graded[1].desc).to.equal("A less basic test to check if adding properly.");
            expect(graded[2].score).to.equal(1);
            expect(graded[2].desc).to.equal("Another basic test to check if adding properly.");
        })
    })
})