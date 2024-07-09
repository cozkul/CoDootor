function test0(fn) {
    var pts = 0;

    if (fn("") === true) pts = 1;
    else pts = 0;
    
    return {"desc": "Test with empty string", score: pts};
}

function test1(fn) {
    var pts = 0;

    if (fn("a") === true) pts = 1;
    else pts = 0;
    
    return {"desc": "A test with a single character", score: pts};
}

function test2(fn) {
    var pts = 0;

    if (fn("racecar") == true) pts = 1;
    else pts = 0;
    
    return {"desc": "Test with input word \"racecar\".", score: pts};
}

function test3(fn) {
    var pts = 0;

    if (fn("mlem mlom") == false) pts = 1;
    else pts = 0;
    
    return {"desc": "A secret test with a mystery character sequence.", score: pts};
}

function test4(fn) {
    var pts = 0;

    if (fn("The quick brown fox jumps over the lazy dog.") == false) pts = 1;
    else pts = 0;
    
    return {"desc": "Test with input sentence \"The quick brown fox jumps over the lazy dog.\".", score: pts};
}

function run_tests(fn) {
    var tests = [test0, test1, test2, test3, test4];
    var results = [];

    for (var i = 0; i < tests.length; i++) {
        results.push(tests[i](fn));
    }

    return results;
}

module.exports = { run_tests };