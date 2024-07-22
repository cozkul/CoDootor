import React, { useEffect, useState } from 'react';
import { Accordion, Button } from '@mantine/core';
import { useUser } from '@auth0/nextjs-auth0/client';

/* 
    Shows a list of all the past attempts on the current question
    Clicking on the attempt panel will load the attempt data into the form
*/

const AttemptsList = ({ questionID, callback }) => {
    const [attempts, setAttempts] = useState([]);
    const { user } = useUser();

    if (!user) return (<div>Loading...</div>);

    const fetchAttempts = async () => {
        try {
            const res = await fetch('/api/token');
            const { token } = await res.json();
            const response = await fetch(`http://localhost:5001/question/${questionID}/attempts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setAttempts(data);
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
                <Button onClick={() => {callback(attempt);}}>Load Attempt</Button>
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