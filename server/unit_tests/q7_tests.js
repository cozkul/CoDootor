var tests = {
    "test1": {
        "input_args": [[0], [1]],
        "expected_outputs": [1, 1],
        "pts": 1,
        "desc": "Test base cases.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [[7]],
        "expected_outputs": [5040],
        "pts": 1,
        "desc": "A less basic test to check with moderate size output.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [[18]],
        "expected_outputs": [6402373705728000],
        "pts": 1,
        "desc": "An input that's meant to generate a massive output.",
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

// function test0(fn) {
//     var pts = 0;

//     if (fn(0) === 1 && fn(1) === 1) pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test base cases.", score: pts};
// }

// function test1(fn) {
//     var pts = 0;

//     if (fn(7) === 5040) pts = 1;
//     else pts = 0;
    
//     return {"desc": "A less basic test to check with moderate size output.", score: pts};
// }

// function test2(fn) {
//     var pts = 0;

//     if (fn(18) === 6402373705728000) pts = 1;
//     else pts = 0;
    
//     return {"desc": "An input that's meant to generate a massive output.", score: pts};
// }

// function run_tests(fn) {
//     var tests = [test0, test1, test2];
//     var results = [];

//     for (var i = 0; i < tests.length; i++) {
//         results.push(tests[i](fn));
//     }

//     return results;
// }

module.exports = { run_tests };