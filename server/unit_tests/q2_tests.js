var tests = {
    "test1": {
        "input_args": [["Hello World"]],
        "expected_outputs": ["hello world"],
        "pts": 1,
        "desc": "Test if the function converts 'Hello World' to 'hello world'.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [["JavaScript"], ["UNIT TEST"]],
        "expected_outputs": ["javascript", "unit test"],
        "pts": 1,
        "desc": "Test if the function converts 'JavaScript' to 'javascript' and 'UNIT TEST' to 'unit test'.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [["CPsc310"], ["LEo"]],
        "expected_outputs": ["cpsc310", "leo"],
        "pts": 1,
        "desc": "Test if the function converts 'CPsc310' to 'cpsc310' and 'LEo' to 'leo'.",
        "passed": false,
        "actual_outputs": []
    }
}

module.exports = { tests };
