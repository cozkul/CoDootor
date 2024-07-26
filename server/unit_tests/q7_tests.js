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

module.exports = { tests };