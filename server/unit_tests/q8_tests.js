var tests = {
    "test1": {
        "input_args": [["Hello, ", "World!"]],
        "expected_outputs": ["Hello, World!"],
        "pts": 1,
        "desc": "Test merging 'Hello, ' and 'World!'.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [["Good", "Morning"]],
        "expected_outputs": ["GoodMorning"],
        "pts": 1,
        "desc": "Test merging 'Good' and 'Morning'.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [["", "Test"]],
        "expected_outputs": ["Test"],
        "pts": 1,
        "desc": "Test merging empty string and 'Test'.",
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

// // Test that checks if given str1 and str2 -> str1+str2, worth 1 point
// function test0(fn) {
//     var pts = 0;

//     if (fn("Hello, ", "World!") === "Hello, World!") pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test merging 'Hello, ' and 'World!'.", score: pts};
// }

// function test1(fn) {
//     var pts = 0;

//     if (fn("Good", "Morning") === "GoodMorning") pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test merging 'Good' and 'Morning'.", score: pts};
// }

// function test2(fn) {
//     var pts = 0;

//     if (fn("", "Test") === "Test") pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test merging empty string and 'Test'.", score: pts};
// }

// function run_tests(fn) {
//     var tests = [test0, test1, test2];
//     var results = [];

//     // Run all the tests specified
//     for (var i = 0; i < tests.length; i++) {
//         results.push(tests[i](fn));
//     }

//     return results;
// }

module.exports = { run_tests };
