// Test that checks base case input of 0
function testFib0(fn) {
    var pts = 0;
    var result = fn(0);

    if (result === 0) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns '0' when input is '0'.", score: pts};
}

// Test that checks base case input of 1
function testFib1(fn) {
    var pts = 0;
    var result = fn(1);

    if (result === 1) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns '1' when input is '1'.", score: pts};
}

// Test that checks appropriate integer is outputted when input is 20
function testFib2(fn) {
    var pts = 0;
    var result = fn(20);

    if (result === 6765) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns the right number when input is '20'.", score: pts};
}

function run_tests(fn) {
    var tests = [testFib0, testFib1, testFib2];
    var results = [];

    // Run all the tests specified
    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };
