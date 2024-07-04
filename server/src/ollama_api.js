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
    if (x == null || x == undefined || x == "") return null;
    return "Write me a Javascript function that has the following purpose: " + x + 
    ". Only show me the code and call the function foo."
}

/*
    Validates the user description to check for potentially malicious context, such as infinite loop.
    Returns true if the description contains one of these, otherwise false. 
*/

function isMalicious(desc) {
    if (!desc || typeof desc !== "string") return false;

    const lowerDesc = desc.toLowerCase();
    const maliciousContext = [
        "infinite loop",
        "while(true)",
        "for(;;)",
        "eval"
    ];

    return maliciousContext.some(context => lowerDesc.includes(context));
}

/*
    Contacts Ollama using the llama3 model with the parsed query and waits for the response
    Returns the response once it is received or NULL if the LLM failed to provide a proper response
*/
async function FetchResponse(desc) {
    // If the fn description is missing, or the json is not properly formatted, return null
    if (desc == undefined || desc == null || desc == "") return null;
    const prompt = GeneratePrompt(desc);

    if (prompt == null) return null;

    // try {
    //     const response = await ollama.generate({
    //         model: "llama3",
    //         prompt: prompt,
    //         options: {
    //             "seed": 101
    //         }
    //     })
    // } catch (e) {
    //     console.log(e);
    // }
    
    const data = {
        "model": "codellama:7b", 
        "messages": [{"role": "user", "content": prompt}],
        "stream": false,
        "options": {"seed": 101}
    };

    // If fetching from outside the container, then use localhost, otherwise need to use host.docker.internal
    const response = await fetch("http://host.docker.internal:11434/api/chat", {
        method: "POST",
        body: JSON.stringify(data)
    }).then(resp => {
        return resp.json();
    }).then(resp => {
        console.log(resp);
        return resp.message.content;
    }).catch(err => {
        console.log(err);
    })

    console.log(response);

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
    Given the generated code, and question ID, it will
    evaluate the generated code by running test cases for the question
    by writing the LLM code to a js file and running tests on it
    The test cases are retrieved from the appropriate test file based on the QID

    If the specified question ID doesn't exist or the JSON is invalid or null, then return null

    Returns an array with the score and desc for each unit test separately
    E.g. [{"score": 1, "desc": "A basic test"}]
*/

function TestGeneratedCode(code_json) {
    if (code_json == undefined || code_json == null || code_json == {}) return null;

    const code = code_json.llm_code;
    const qid = code_json.id; 

    if (code == null || qid == null || isNaN(qid)) return null;

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

module.exports = { GeneratePrompt, isMalicious, ParseLLMResponse, FetchResponse, TestGeneratedCode };