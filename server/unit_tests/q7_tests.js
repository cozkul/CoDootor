function test0(fn) {
    var pts = 0;

    if (fn(0) === 1 && fn(1) === 1) pts = 1;
    else pts = 0;
    
    return {"desc": "Test base cases.", score: pts};
}

function test1(fn) {
    var pts = 0;

    if (fn(7) === 5040) pts = 1;
    else pts = 0;
    
    return {"desc": "A less basic test to check with moderate size output.", score: pts};
}

function test2(fn) {
    var pts = 0;

    if (fn(18) === 6402373705728000) pts = 1;
    else pts = 0;
    
    return {"desc": "An input that's meant to generate a massive output.", score: pts};
}

function run_tests(fn) {
    var tests = [test0, test1, test2];
    var results = [];

    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };