// Test that checks if 2 + 3 = 5, worth 1 point
function test0(fn) {
    var pts = 0;

    if (fn(2, 3) == 5) pts = 1;
    else pts = 0;
    
    return {"desc": "A test to check if adding properly.", score: pts};
}

function test1(fn) {
    var pts = 0;

    if (fn(5, 2) == 7 && fn(3, 4) == 7) pts = 1;
    else pts = 0;
    
    return {"desc": "A less basic test to check if adding properly.", score: pts};
}

function test2(fn) {
    var pts = 0;

    if (fn(0, 0) == 0 && fn(20, 7) == 27) pts = 1;
    else pts = 0;
    
    return {"desc": "A less basic test to check if adding properly.", score: pts};
}

function run_tests(fn) {
    var tests = [test0, test1, test2];
    var results = [];

    // Run all the tests specified
    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };