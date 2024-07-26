var tests = {
    "test1": {
        "input_args": [[""]],
        "expected_outputs": [true],
        "pts": 1,
        "desc": "Test with empty string.",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [["a"]],
        "expected_outputs": [true],
        "pts": 1,
        "desc": "A test with a single character.",
        "passed": false,
        "actual_outputs": []
    },
    "test3": {
        "input_args": [["racecar"]],
        "expected_outputs": [true],
        "pts": 1,
        "desc": "Test with input word 'racecar'.",
        "passed": false,
        "actual_outputs": []
    },
    "test4": {
        "input_args": [["mlem mlom"]],
        "expected_outputs": [false],
        "pts": 1,
        "desc": "A secret test with a mystery character sequence.",
        "passed": false,
        "actual_outputs": []
    },
    "test5": {
        "input_args": [["The quick brown fox jumps over the lazy dog."]],
        "expected_outputs": [false],
        "pts": 1,
        "desc": "Test with input sentence 'The quick brown fox jumps over the lazy dog.'.",
        "passed": false,
        "actual_outputs": []
    }
}

module.exports = { tests };