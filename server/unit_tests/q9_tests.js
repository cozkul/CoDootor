var tests = {
    "test1": {
        "input_args": [['mississippi', 's']],
        "expected_outputs": [4],
        "pts": 1,
        "desc": "Test using the word 'mississippi'",
        "passed": false,
        "actual_outputs": []
    },
    "test2": {
        "input_args": [["ford prefect", ' a']],
        "expected_outputs": [0],
        "pts": 1,
        "desc": "Test using the word 'ford prefect'.",
        "passed": false,
        "actual_outputs": []
    }
}

module.exports = { tests };
