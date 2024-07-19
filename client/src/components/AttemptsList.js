import React, { useEffect, useState } from 'react';
import { Accordion } from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0/client';

// Function display section for UI, this should retrieve prestored function display of each question
// Perhaps we shouldn't store the LLM generated code for each attempt because if we
// have too many users, then it would take up too much space
// Instead, we should fetch the code from the LLM again after populating the id, desc, and results

// Replace this with a fetch to the localhost:5001/question/{qid}/attempts 
// endpoint to retrieve the attempts taken already

const AttemptsList = ({ questionID, callback }) => {
    const [attempts, setAttempts] = useState([]);
    const { user } = useUser();

    const fetchAttempts = async () => {
        try {
            const res = await fetch('/api/token');
            const { token } = await res.json();
            const response = await fetch(`http://localhost:5001/user/${user.sub.split('|')[1]}/attempts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            const filteredAttempts = data.filter(attempt => attempt.id === questionID);
            setAttempts(filteredAttempts);
        } catch (error) {
            console.error("Failed to fetch attempts:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAttempts();
        }
    }, [questionID, user]);

    const items = attempts.map((attempt, index) => (
        <Accordion.Item key={index} value={`Attempt ${index + 1}`}>
            <Accordion.Control>{`Attempt ${index + 1}`}</Accordion.Control>
            <Accordion.Panel>
                <div>{attempt.desc}</div>
                <div>
                    {attempt.results.map((result, idx) => (
                        <div key={idx}>
                            <span>{`Score: ${result.score}, Desc: ${result.desc}`}</span>
                        </div>
                    ))}
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <Accordion>
            {items}
        </Accordion>
    );
};

export default AttemptsList;