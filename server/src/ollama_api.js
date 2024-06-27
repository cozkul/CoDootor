/*
Functions that interact with Ollama to retrieve the LLM generated code
Parses the response, contacts the LLM, and writes the code to a file.
*/

const { default: ollama } = require('ollama');

/*
    Given the description as a string, generates the prompt for the LLM by appending the
    necessary background info to generate the function.

    If the string is missing or empty, then return null instead
*/

function GeneratePrompt(x) {
    return "Write me a Javascript function that has the following purpose: " + x + 
    ". Only show me the code and call the function foo."
}

/*
    Contacts Ollama using the llama3 model with the parsed query and waits for the response
    Returns the response once it is received or NULL if the LLM failed to provide a proper response
*/
async function FetchResponse(resp_json) {
    // If the fn description is missing, or the json is not properly formatted, return null
    if (resp_json == undefined || resp_json == null || resp_json.desc == null || resp_json.desc == "") return null;
    const prompt = GeneratePrompt(resp_json.desc);

    if (prompt == null) return null;

    const response = await ollama.generate({
        model: "llama3",
        prompt: prompt,
        options: {
            "seed": 101
        }
    })

    // If response can't be acquired from LLM
    if (response == null) return null;

    const parsedResponse = ParseLLMResponse(response.response)

    if (!parsedResponse.endsWith("}")) return null;

    return {"llm_code": parsedResponse};
}

/*
    Takes the Ollama response which should be in the form of a string and then
    parses it so that only the code remains

    Returns null if LLM response is null or if the response isn't in the proper format
    E.g. ``` CODE ```
*/
function ParseLLMResponse(resp) {
    if (resp == undefined || resp == null) return null;

    const words = resp.split("```");
    if (words.length < 3) return null;

    return words[1].trim();
}

/*  
    Given the username, generated code, and question ID, it will
    evaluate the generated code by running test cases for the question
    by writing the LLM code to a js file and running tests on it
    The test cases are retrieved from the appropriate test file based on the QID

    If the specified question ID doesn't exist or the JSON is invalid or null, then return null

    Returns an array with the score for each unit test separately
    E.g. [2, 1, 0, 1, 2] indicates that the user received 2 points for test 1, 1 point for test 2, 0 points for test 3, etc.
*/

function TestGeneratedCode(code_json) {
    if (code_json == undefined || code_json == null || code_json == {}) return null;

    const user = code_json.user;
    const code = code_json.llm_code;
    const qid = code_json.id; 

    if (user == null || code == null || qid == null || isNaN(qid)) return null;

    // Convert the stringified code to an actual function and ensures the fn is named foo

    // Parse the file path for the question's tests
    const test_fp = "../unit_tests/" + "q" + qid.toString() + "_tests.js";
    var res = null;

    // Run the tests on the foo function
    try {
        eval("var foo = " + code);
        const tester = require(test_fp);
        res = tester.run_tests(foo);
    } catch (err) {
        return [{err: true, err_reason: err.toString()}];
    }

    return res;
}

module.exports = { ParseLLMResponse, FetchResponse, TestGeneratedCode };