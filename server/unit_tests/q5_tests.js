// Test checks that output is an empty string if input is also an empty string
function testRev0(fn) {
    var pts = 0;
    var input = ''
    var result = fn(input);

    if (result === '') {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns '' if the input is ''.", score: pts};
}

// Test checks that output is a reverse of the input for 'hotdog'
function testRev1(fn) {
    var pts = 0;
    var input = 'hotdog'
    var result = fn(input);

    if (result === 'godtoh') {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns 'godtoh' if the input is 'hotdog'.", score: pts};
}

// Test checks that output is a reverse of the input for 'racecar'
function testRev2(fn) {
    var pts = 0;
    var input = 'racecar'
    var result = fn(input);

    if (result === input) {
        pts = 1;
    } else {
        pts = 0;
    }
    
    return {"desc": "Test if the function returns 'racecar' if the input is 'racecar'.", score: pts};
}


function run_tests(fn) {
    var tests = [testRev0, testRev1, testRev2];
    var results = [];

    // Run all the tests specified
    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };
