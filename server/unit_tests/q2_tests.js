// Test that checks if "Hello World" -> "hello world", worth 1 point
function testLower0(fn) {
    var pts = 0;
    var result = fn("Hello World");

    if (result === "hello world") pts = 1;
    else pts = 0;
    
    return {"desc": "Test if the function converts 'Hello World' to 'hello world'.", score: pts};
}

function testLower1(fn) {
    var pts = 0;
    var result1 = fn("JavaScript");
    var result2 = fn("UNIT TEST");

    if (result1 === "javascript" && result2 === "unit test") pts = 1;
    else pts = 0;
    
    return {"desc": "Test if the function converts 'JavaScript' to 'javascript' and 'UNIT TEST' to 'unit test'.", score: pts};
}

function run_tests(fn) {
    var tests = [testLower0, testLower1];
    var results = [];

    // Run all the tests specified
    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };
