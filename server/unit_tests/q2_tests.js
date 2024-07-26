var tests = {
    "test1": {
        "input_args": [["Hello World"]],
        "expected_outputs": ["hello world"],
        "pts": 1,
        "desc": "Test if the function converts 'Hello World' to 'hello world'.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [["JavaScript"], ["UNIT TEST"]],
        "expected_outputs": ["javascript", "unit test"],
        "pts": 1,
        "desc": "Test if the function converts 'JavaScript' to 'javascript' and 'UNIT TEST' to 'unit test'.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [["CPsc310"], ["LEo"]],
        "expected_outputs": ["cpsc310", "leo"],
        "pts": 1,
        "desc": "Test if the function converts 'CPsc310' to 'cpsc310' and 'LEo' to 'leo'.",
        "passed": false,
        "actual_outputs": []
    }
}

function run_tests(fn) {
    var results = []
    const keys = Object.keys(tests);
    for (var i = 0; i < keys.length; i++) {
        const curTest = tests[keys[i]]
        const args = curTest.input_args;
        const outputs = curTest.expected_outputs;
        results.push(curTest);
        for (var j = 0; j < curTest.input_args.length; j++) {
            try {
                const actualOutput = fn(...args[j])
                const expectedOutput = outputs[j]

                if (actualOutput == expectedOutput) {
                    results[i].passed = true;
                    results[i].actual_outputs.push(actualOutput);
                }
            } catch (err) {
                results[i].actual_outputs.push(err);
            }
        }
    }

    return results;
}

// Test that checks if "Hello World" -> "hello world", worth 1 point
// function testLower0(fn) {
//     var pts = 0;
//     var result = fn("Hello World");

//     if (result === "hello world") pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test if the function converts 'Hello World' to 'hello world'.", score: pts};
// }

// function testLower1(fn) {
//     var pts = 0;
//     var result1 = fn("JavaScript");
//     var result2 = fn("UNIT TEST");

//     if (result1 === "javascript" && result2 === "unit test") pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test if the function converts 'JavaScript' to 'javascript' and 'UNIT TEST' to 'unit test'.", score: pts};
// }

// function testLower2(fn) {
//     var pts = 0;
//     var result1 = fn("CPsc310");
//     var result2 = fn("LEo");

//     if (result1 === "cpsc310" && result2 === "leo") pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test if the function converts 'CPsc310' to 'cpsc310' and 'LEo' to 'leo'.", score: pts};
// }

// function run_tests(fn) {
//     var tests = [testLower0, testLower1, testLower2];
//     var results = [];

//     // Run all the tests specified
//     for (var i = 0; i < tests.length; i++) {
//         results.push(tests[i](fn));
//     }

//     return results;
// }

module.exports = { run_tests };
