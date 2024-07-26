var tests = {
    "test1": {
        "input_args": [[""]],
        "expected_outputs": [true],
        "pts": 1,
        "desc": "Test with empty string.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [["a"]],
        "expected_outputs": [true],
        "pts": 1,
        "desc": "A test with a single character.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [["racecar"]],
        "expected_outputs": [true],
        "pts": 1,
        "desc": "Test with input word 'racecar'.",
        "passed": false,
        "actual_outputs": []
    },
    "test4": {
        "input_args": [["mlem mlom"]],
        "expected_outputs": [false],
        "pts": 1,
        "desc": "A secret test with a mystery character sequence.",
        "passed": false,
        "actual_outputs": []
    },
    "test5": {
        "input_args": [["The quick brown fox jumps over the lazy dog."]],
        "expected_outputs": [false],
        "pts": 1,
        "desc": "Test with input sentence 'The quick brown fox jumps over the lazy dog.'.",
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

//     if (fn("") === true) pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test with empty string", score: pts};
// }

// function test1(fn) {
//     var pts = 0;

//     if (fn("a") === true) pts = 1;
//     else pts = 0;
    
//     return {"desc": "A test with a single character", score: pts};
// }

// function test2(fn) {
//     var pts = 0;

//     if (fn("racecar") == true) pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test with input word \"racecar\".", score: pts};
// }

// function test3(fn) {
//     var pts = 0;

//     if (fn("mlem mlom") == false) pts = 1;
//     else pts = 0;
    
//     return {"desc": "A secret test with a mystery character sequence.", score: pts};
// }

// function test4(fn) {
//     var pts = 0;

//     if (fn("The quick brown fox jumps over the lazy dog.") == false) pts = 1;
//     else pts = 0;
    
//     return {"desc": "Test with input sentence \"The quick brown fox jumps over the lazy dog.\".", score: pts};
// }

// function run_tests(fn) {
//     var tests = [test0, test1, test2, test3, test4];
//     var results = [];

//     for (var i = 0; i < tests.length; i++) {
//         results.push(tests[i](fn));
//     }

//     return results;
// }

module.exports = { run_tests };