'use client'

import { Title, Progress, Text, Timeline, Avatar } from '@mantine/core';

export default function UserProfile( {totalQuestions, user, otherUser} ) {
    var count = 0;
    var question_scores = [];

    for (var i = 1; i < totalQuestions; i++) {
        if (otherUser.questions_solved[i] && otherUser.questions_solved[i] > 0) {
            question_scores.push(otherUser.questions_solved[i]);
            count++;
        } else {
            question_scores.push(0);
        }
    }

    const numQuestionsCompleted = count;
    const curProgress = Math.max(0, numQuestionsCompleted - 1);
    const pctQuestionsCompleted = Math.floor(numQuestionsCompleted / 10 * 100);

    const questionProgress = question_scores.map((key, idx) => 
        <Timeline.Item 
            key={idx} 
            title={"Question " + (idx + 1).toString()}
        >
            {key ? <Text size="sm">Score: {key}</Text> :
            <Text c="dimmed" size="sm">Unsolved</Text>
            }
        </Timeline.Item>
    )
    
    return (
        <div>
            <Title>Welcome to {(user.user_id == otherUser.user_id ? "Your" : otherUser.nickname + "'s")} Profile</Title>
            <br/>
            <Title order={2}>Question Progress</Title>
            <Progress.Root size={40}>
                <Progress.Section value={pctQuestionsCompleted}>
                    <Progress.Label>{numQuestionsCompleted} Completed</Progress.Label>
                </Progress.Section>
                <Progress.Section value={100 - pctQuestionsCompleted} color="gray">
                    <Progress.Label>{10 - numQuestionsCompleted} Remaining</Progress.Label>
                </Progress.Section>
            </Progress.Root>
            <br></br>
            <Timeline bulletSize={40} lineWidth={6} color="green" active={curProgress}>
                {questionProgress}
            </Timeline>
        </div>
    )
}