import React from 'react';
import { Accordion } from '@mantine/core'

// Function display section for UI, this should retrieve prestored function display of each question
const FunctionDisplay = () => {
    // Perhaps we shouldn't store the LLM generated code for each attempt because if we
    // have too many users, then it would take up too much space
    // Instead, we should fetch the code from the LLM again after populating the id, desc, and results

    // Replace this with a fetch to the localhost:5001/question/{qid}/attempts 
    // endpoint to retrieve the attempts taken already
    
    const attempts = [{
        "id": 1,
        "desc": "Given two numbers, returns the sum of both of them",
        "results": [{"score": 1, "desc": "A basic test"}, {"score": 1, "desc": "Another basic test."}]
    }];
    const items = attempts.map((attempt) => {
        <Accordion.Item key={attempt.id} value={"Attempt " + attempt.id} onclick={
            () => {
                console.log(attempt.id);
            }
        }>
        </Accordion.Item>
    });
    return (
        <Accordion>
            {items}
        </Accordion>
    );
};

export default FunctionDisplay;
