var tests = {
    "test1": {
        "input_args": [[2, 3]],
        "expected_outputs": [5],
        "pts": 1,
        "desc": "A test to check if adding properly.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [[5, 2], [3, 4]],
        "expected_outputs": [7, 7],
        "pts": 1,
        "desc": "A less basic test to check if adding properly.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [[0, 0], [20, 7]],
        "expected_outputs": [0, 27],
        "pts": 1,
        "desc": "Another basic test to check if adding properly.",
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

// // Test that checks if 2 + 3 = 5, worth 1 point
// function test0(fn) {
//     var pts = 0;

//     if (fn(2, 3) == 5) pts = 1;
//     else pts = 0;
    
//     return {"desc": "A test to check if adding properly.", score: pts};
// }

// function test1(fn) {
//     var pts = 0;

//     if (fn(5, 2) == 7 && fn(3, 4) == 7) pts = 1;
//     else pts = 0;
    
//     return {"desc": "A less basic test to check if adding properly.", score: pts};
// }

// function test2(fn) {
//     var pts = 0;

//     if (fn(0, 0) == 0 && fn(20, 7) == 27) pts = 1;
//     else pts = 0;
    
//     return {"desc": "Another basic test to check if adding properly.", score: pts};
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