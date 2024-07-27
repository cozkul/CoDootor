var tests = {
    "test1": {
        "input_args": [[5, 5]],
        "expected_outputs": [0],
        "pts": 1,
        "desc": "Test using two of the same number.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [[12345678, 1]],
        "expected_outputs": [0],
        "pts": 1,
        "desc": "Test using a large number and a small number.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [[100, 3]],
        "expected_outputs": [1],
        "pts": 1,
        "desc": "Test using a medium number and a small number.",
        "passed": false,
        "actual_outputs": []
    },
}

module.exports = { tests };
