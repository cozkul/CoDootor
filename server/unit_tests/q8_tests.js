// Test that checks if given str1 and str2 -> str1+str2, worth 1 point
function test0(fn) {
    var pts = 0;

    if (fn("Hello, ", "World!") === "Hello, World!") pts = 1;
    else pts = 0;
    
    return {"desc": "Test merging 'Hello, ' and 'World!'.", score: pts};
}

function test1(fn) {
    var pts = 0;

    if (fn("Good", "Morning") === "GoodMorning") pts = 1;
    else pts = 0;
    
    return {"desc": "Test merging 'Good' and 'Morning'.", score: pts};
}

function test2(fn) {
    var pts = 0;

    if (fn("", "Test") === "Test") pts = 1;
    else pts = 0;
    
    return {"desc": "Test merging empty string and 'Test'.", score: pts};
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
