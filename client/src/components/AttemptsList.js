import React, { useEffect, useState } from 'react';
import { Accordion, Button, Rating } from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
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

    const items = attempts.map((attempt, index) => {
        const totalScore = attempt.results.reduce((acc, cur) => acc + cur.score, 0);
        const maxScore = attempt.results.length;
        const numStars = Math.floor((totalScore / maxScore) / 0.33);
        return (
        <Accordion.Item key={index} value={`Attempt ${index + 1}`}>
            <Accordion.Control icon={<Rating emptySymbol={<IconStar/>} fullSymbol={<IconStarFilled/>} count={3} defaultValue={numStars} readOnly/>}>
                    {`Attempt ${index + 1}`}
                    
            </Accordion.Control>
            <Accordion.Panel>
                <div>{attempt.desc}</div>
                <div>
                    {attempt.results.map((result, idx) => (
                        <div key={idx}>
                            <span>{`Score: ${result.score}, Desc: ${result.desc}`}</span>
                        </div>
                    ))}
                </div>
                <div>{`Comment: ${attempt.comment}`}</div>
                <Button onClick={() => {callback(attempt);}}>Load Attempt</Button>
            </Accordion.Panel>
        </Accordion.Item>
    )});

    return (
        <Accordion variant="contained" chevronPosition="left" miw={500}>
            {items}
        </Accordion>
    );
};

export default AttemptsList;