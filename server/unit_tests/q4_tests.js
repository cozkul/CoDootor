// Test for where input is array of increasing numbers
function testMax0(fn) {
    var pts = 0;
    var arr = [0, 1, 2, 3, 4, 5]
    var result = fn(arr);

    if (result === 5) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns the right output when the input is [5, 4, 3, 2, 1, 0].", score: pts};
}

// Test for where input is array of decreasing numbers
function testMax1(fn) {
    var pts = 0;
    var arr = [5, 4, 3, 2, 1, 0]
    var result = fn(arr);

    if (result === 5) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns the right output when the input is [5, 4, 3, 2, 1, 0].", score: pts};
}

// Test for where input is an array of a mix of negative and positive numbers
function testMax2(fn) {
    var pts = 0;
    var arr = [-101, 452, 97, 2, 78, 6546, 6102, 0, 9982]
    var result = fn(arr);

    if (result === 9982) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns the right output when the input is [-101, 452, 97, 2, 78, 6546, 6102, 0, 9982].", score: pts};
}

// Test for where input is an empty array
function testMax3(fn) {
    var pts = 0;
    var arr = []
    var result = fn(arr);

    if (result === Number.NEGATIVE_INFINITY) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns negative infinity when given an empty input.", score: pts};
}

function run_tests(fn) {
    var tests = [testMax0, testMax1, testMax2, testMax3];
    var results = [];

    // Run all the tests specified
    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };
